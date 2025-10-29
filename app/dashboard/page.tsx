"use client"

import * as React from "react"
import * as XLSX from "xlsx"
import { Calendar as CalendarIcon, FileDown } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    HazardTypeChart,
    FactorChart,
    LocationChart,
} from "@/components/dashboard-charts"
import { IssueDataTable } from "@/components/dashboard-table"
import { Issue } from "@/components/issue-card"
import { UserProfileBadge } from "@/components/user-profile-badge"
import { IssueDetailModal } from "@/components/issue-detail-modal"

// ---
// 헬퍼 컴포넌트 (DashboardContent)
// ---
interface DashboardContentProps {
    siteName: string
    issues: Issue[]
    onExcelExport: (data: Issue[], siteName: string) => void
    onRowClick: (issue: Issue) => void // [확인] onRowClick prop이 정의되어 있어야 함
}

function DashboardContent({
    siteName,
    issues,
    onExcelExport,
    onRowClick, // [확인] prop을 받고 있음
}: DashboardContentProps) {
    const filteredIssues =
        siteName === "전체"
            ? issues
            : issues.filter((issue) => issue.location.startsWith("1C A"))

    const kpi = {
        score: siteName === "전체" ? "85점" : "78점",
        totalIssues:
            siteName === "전체"
                ? `${issues.length}건`
                : `${filteredIssues.length}건`,
        pendingIssues: `${issues.filter((i) => i.status === "pending").length}건`,
        completedIssues: `${issues.filter((i) => i.status === "completed").length
            }건`,
    }

    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">종합 현황 (Overview)</TabsTrigger>
                <TabsTrigger value="details">상세 데이터</TabsTrigger>
            </TabsList>

            {/* 1. 종합 현황 탭 */}
            <TabsContent value="overview" className="space-y-4">
                {/* ... KPI 카드들 ... */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {siteName} 안전 점수
                            </CardTitle>
                            <span className="text-lg">💯</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.score}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {siteName} 총 지적 건수
                            </CardTitle>
                            <span className="text-lg">📉</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.totalIssues}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {siteName} 개선 필요
                            </CardTitle>
                            <span className="text-lg">⚠️</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {kpi.pendingIssues}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {siteName} 개선 완료
                            </CardTitle>
                            <span className="text-lg">✅</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {kpi.completedIssues}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ... 차트들 ... */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{siteName} 재해 유형별</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <HazardTypeChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{siteName} 위험 요인별 (Top 10)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FactorChart />
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{siteName} 위험 장소별 (Top 10)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LocationChart />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* 2. 상세 데이터 탭 */}
            <TabsContent value="details" className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{siteName} 최근 지적 사항 목록</CardTitle>
                            <CardDescription>
                                기간 내 모든 지적 사항 목록입니다. (항목 클릭 시 상세 보기)
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => onExcelExport(filteredIssues, siteName)}
                            size="sm"
                        >
                            <FileDown className="mr-2 h-4 w-4" />
                            엑셀 내보내기
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {/* [확인] onRowClick이 IssueDataTable로 전달되고 있어야 함 */}
                        <IssueDataTable data={filteredIssues} onRowClick={onRowClick} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

// ---
// 메인 대시보드 페이지 컴포넌트
// ---

const placeholderBefore =
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%2364748b">개선 전 사진</text></svg>'
const placeholderAfter =
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23dcfce7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23166534">개선 후 사진</text></svg>'

const mockIssuesData: Issue[] = [
    {
        id: "1",
        date: "2025-10-27",
        location: "1C A 3F",
        area: "도크 내",
        factor: "통로",
        hazard: "부딪힘",
        status: "pending",
        before_image: placeholderBefore,
        before_comment: "AGV 로봇과 보행자 통로 구분이 없음.",
    },
    {
        id: "2",
        date: "2025-10-27",
        location: "2C",
        area: "파렛트렉",
        factor: "물품",
        hazard: "맞음",
        status: "completed",
        before_image: placeholderBefore,
        before_comment: "파렛트 랩핑 불량으로 낙하 위험.",
        top_manager_plan: "전체 재랩핑 및 적치 상태 확인.",
        after_image: placeholderAfter,
        after_comment: "조치 완료.",
    },
    {
        id: "3",
        date: "2025-10-26",
        location: "1C B 3F",
        area: "RFID 라인",
        factor: "지게차",
        hazard: "부딪힘",
        status: "inprogress",
        before_image: placeholderBefore,
        before_comment: "지게차 회전 반경 내 근로자 충돌 위험.",
        top_manager_plan: "펜스 설치 및 바닥 라인 테이핑.",
    },
    {
        id: "4",
        date: "2025-10-26",
        location: "1C A 2F",
        area: "컨베이어",
        factor: "컨베이어",
        hazard: "끼임",
        status: "pending",
        before_image: placeholderBefore,
        before_comment: "롤러 구동부 덮개 이탈.",
    },
]

export default function DashboardPage() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    })

    const [issues, setIssues] = React.useState(mockIssuesData)
    const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null)

    const handleExcelExport = (data: Issue[], siteName: string) => {
        const formattedData = data.map((issue) => ({
            점검일: issue.date,
            "센터/층수": issue.location,
            "세부 위치": issue.area,
            요인: issue.factor,
            "재해 유형": issue.hazard,
            "개선 상태":
                issue.status === "pending"
                    ? "개선 필요"
                    : issue.status === "inprogress"
                        ? "개선 중"
                        : "개선 완료",
            "개선 전 내용": issue.before_comment,
            "개선 방안": issue.top_manager_plan || "",
            "개선 후 내용": issue.after_comment || "",
        }))
        const ws = XLSX.utils.json_to_sheet(formattedData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, `${siteName} 순회점검 상세 데이터`)
        XLSX.writeFile(
            wb,
            `${siteName}_순회점검_${format(new Date(), "yyyyMMdd")}.xlsx`,
        )
    }

    // [확인] 이 핸들러가 정의되어 있어야 함
    const handleRowClick = (issue: Issue) => {
        setSelectedIssue(issue)
    }

    const handleUpdatePlan = (issueId: string, plan: string) => {
        console.log(`Updating issue ${issueId} with plan: ${plan}`)
        setIssues((prevIssues) =>
            prevIssues.map((issue) =>
                issue.id === issueId
                    ? { ...issue, status: "inprogress", top_manager_plan: plan }
                    : issue,
            ),
        )
        setSelectedIssue(null)
    }

    return (
        <div className="flex-col md:flex">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">안전 점검 대시보드</h2>
                    <div className="flex items-center space-x-4">
                        <UserProfileBadge roleName="최고 관리자" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[300px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "yyyy/MM/dd")} -{" "}
                                                {format(date.to, "yyyy/MM/dd")}
                                            </>
                                        ) : (
                                            format(date.from, "yyyy/MM/dd")
                                        )
                                    ) : (
                                        <span>기간 선택</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">전체</TabsTrigger>
                        <TabsTrigger value="yeosu1">여수1</TabsTrigger>
                        <TabsTrigger value="yeosu2">여수2</TabsTrigger>
                        <TabsTrigger value="yeosu3">여수3</TabsTrigger>
                        <TabsTrigger value="yeosu4">여수4</TabsTrigger>
                        <TabsTrigger value="rc">RC</TabsTrigger>
                    </TabsList>

                    {/* [확인] onRowClick={handleRowClick}이 전달되고 있어야 함 */}
                    <TabsContent value="all" className="mt-4">
                        <DashboardContent
                            siteName="전체"
                            issues={issues}
                            onExcelExport={handleExcelExport}
                            onRowClick={handleRowClick}
                        />
                    </TabsContent>

                    <TabsContent value="yeosu1" className="mt-4">
                        <DashboardContent
                            siteName="여수1"
                            issues={issues}
                            onExcelExport={handleExcelExport}
                            onRowClick={handleRowClick}
                        />
                    </TabsContent>

                    {/* ... 나머지 탭 ... */}
                    <TabsContent value="yeosu2" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>여수2 데이터</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>여수2 사업장의 데이터가 여기에 표시됩니다.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="yeosu3" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>여수3 데이터</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>여수3 사업장의 데이터가 여기에 표시됩니다.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="yeosu4" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>여수4 데이터</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>여수4 사업장의 데이터가 여기에 표시됩니다.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rc" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>RC 데이터</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>RC 사업장의 데이터가 여기에 표시됩니다.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* [확인] 모달 렌더링 로직이 있어야 함 */}
            {selectedIssue && (
                <IssueDetailModal
                    issue={selectedIssue}
                    open={!!selectedIssue}
                    onOpenChange={(open) => {
                        if (!open) setSelectedIssue(null)
                    }}
                    onUpdatePlan={handleUpdatePlan}
                />
            )}
        </div>
    )
}