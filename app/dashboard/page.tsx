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
import { IssueDataTable, IssueData } from "@/components/dashboard-table"
import { UserProfileBadge } from "@/components/user-profile-badge"

// ---
// [수정] 헬퍼 컴포넌트를 메인 컴포넌트 밖으로 분리했습니다.
// ---
interface DashboardContentProps {
    siteName: string
    issues: IssueData[]
    onExcelExport: (data: IssueData[], siteName: string) => void
}

function DashboardContent({
    siteName,
    issues,
    onExcelExport,
}: DashboardContentProps) {
    // TODO: 실제로는 siteName을 기준으로 데이터를 다시 fetch 하거나
    // 부모에서 받은 전체 issues를 siteName으로 필터링해야 합니다.
    // UI 데모용: '전체'가 아니면 mock 데이터 필터링 시늉
    const filteredIssues =
        siteName === "전체"
            ? issues
            : issues.filter((issue) => issue.location.startsWith("1C A")) // '여수1'은 '1C A'만 본다고 가정

    // siteName에 따라 KPI 데이터 변경 (데모)
    const kpi = {
        score: siteName === "전체" ? "85점" : "78점",
        totalIssues: siteName === "전체" ? "216건" : "48건",
        pendingIssues: siteName === "전체" ? "32건" : "8건",
        completedIssues: siteName === "전체" ? "184건" : "40건",
    }

    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">종합 현황 (Overview)</TabsTrigger>
                <TabsTrigger value="details">상세 데이터</TabsTrigger>
            </TabsList>

            {/* 1. 종합 현황 탭 */}
            <TabsContent value="overview" className="space-y-4">
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
                                기간 내 모든 지적 사항 목록입니다.
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
                        <IssueDataTable data={filteredIssues} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

// ---
// [수정] 여기가 메인 대시보드 페이지 컴포넌트입니다.
// ---
const mockIssues: IssueData[] = [
    {
        id: "1",
        date: "2025-10-27",
        location: "1C A 3F",
        area: "도크 내",
        factor: "통로",
        hazard: "부딪힘",
        status: "pending",
    },
    {
        id: "2",
        date: "2025-10-27",
        location: "2C",
        area: "파렛트렉",
        factor: "물품",
        hazard: "맞음",
        status: "completed",
    },
    {
        id: "3",
        date: "2025-10-26",
        location: "1C B 3F",
        area: "RFID 라인",
        factor: "지게차",
        hazard: "부딪힘",
        status: "pending",
    },
    {
        id: "4",
        date: "2025-10-26",
        location: "1C A 2F",
        area: "컨베이어",
        factor: "컨베이어",
        hazard: "끼임",
        status: "completed",
    },
]

export default function DashboardPage() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    })

    const handleExcelExport = (data: IssueData[], siteName: string) => {
        const formattedData = data.map((issue) => ({
            점검일: issue.date,
            "센터/층수": issue.location,
            "세부 위치": issue.area,
            요인: issue.factor,
            "재해 유형": issue.hazard,
            "개선 상태": issue.status === "pending" ? "개선 필요" : "개선 완료",
        }))
        const ws = XLSX.utils.json_to_sheet(formattedData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, `${siteName} 순회점검 상세 데이터`)
        XLSX.writeFile(
            wb,
            `${siteName}_순회점검_${format(new Date(), "yyyyMMdd")}.xlsx`,
        )
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

                {/* [수정] 사업장별 필터 Tabs. space-y-4 제거 */}
                <Tabs defaultValue="all">
                    <TabsList>
                        <TabsTrigger value="all">전체</TabsTrigger>
                        <TabsTrigger value="yeosu1">여수1</TabsTrigger>
                        <TabsTrigger value="yeosu2">여수2</TabsTrigger>
                        <TabsTrigger value="yeosu3">여수3</TabsTrigger>
                        <TabsTrigger value="yeosu4">여수4</TabsTrigger>
                        <TabsTrigger value="rc">RC</TabsTrigger>
                    </TabsList>

                    {/* 1. '전체' 탭. [수정] mt-4 추가 */}
                    <TabsContent value="all" className="mt-4">
                        <DashboardContent
                            siteName="전체"
                            issues={mockIssues}
                            onExcelExport={handleExcelExport}
                        />
                    </TabsContent>

                    {/* 2. '여수1' 탭. [수정] mt-4 추가 */}
                    <TabsContent value="yeosu1" className="mt-4">
                        <DashboardContent
                            siteName="여수1"
                            issues={mockIssues}
                            onExcelExport={handleExcelExport}
                        />
                    </TabsContent>

                    {/* 3. '여수2' 탭. [수정] mt-4 추가 */}
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

                    {/* 4. '여수3' 탭. [수정] mt-4 추가 */}
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

                    {/* 5. '여수4' 탭. [수정] mt-4 추가 */}
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

                    {/* 6. 'RC' 탭. [수정] mt-4 추가 */}
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
        </div>
    )
}