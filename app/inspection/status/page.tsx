"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { UserProfileBadge } from "@/components/user-profile-badge"
import { Issue, IssueCard } from "@/components/issue-card"
import { Badge } from "@/components/ui/badge"

// [수정] SVG 데이터 URL을 임시 이미지로 사용합니다.
const placeholderBefore =
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%2364748b">개선 전 사진</text></svg>'
const placeholderAfter =
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23dcfce7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23166534">개선 후 사진</text></svg>'

// UI 데모를 위한 Mock 데이터
const allIssues: Issue[] = [
    // 1. 개선 필요
    {
        id: "ISSUE-001",
        location: "1C A 2F",
        area: "도크 전반",
        factor: "물품",
        hazard: "화재",
        before_image: placeholderBefore, // [수정]
        before_comment: "소화전 앞에 물품이 적치되어 있음. 화재 시 사용 불가.",
        status: "pending",
    },
    // 2. 개선 중
    {
        id: "ISSUE-002",
        location: "1C A 3F",
        area: "RFID 라인",
        factor: "지게차",
        hazard: "부딪힘",
        before_image: placeholderBefore, // [수정]
        before_comment: "지게차 이동 경로와 작업자 보행 경로가 겹침.",
        status: "inprogress",
        top_manager_plan: "1. 펜스 구분 구획 설치 / 2. 통로 라인 테이핑 명확히 할 것.",
    },
    {
        id: "ISSUE-003",
        location: "2C",
        area: "메자닌 개구부",
        factor: "안전보건표지",
        hazard: "떨어짐",
        before_image: placeholderBefore, // [수정]
        before_comment: "개구부 주변에 추락 위험 표지가 없음.",
        status: "inprogress",
        top_manager_plan: "즉시 '추락주의' 경고 표지 부착 관리 바람.",
    },
    // 3. 개선 완료
    {
        id: "ISSUE-004",
        location: "1C B 2F",
        area: "S02 파레트랙",
        factor: "물품",
        hazard: "맞음",
        before_image: placeholderBefore, // [수정]
        before_comment: "적치 물품 랩핑 처리가 미흡하여 낙하 위험이 있음.",
        status: "completed",
        top_manager_plan: "전체 랩핑 후 적치 보관할 것.",
        after_image: placeholderAfter, // [수정]
        after_comment: "지시대로 랩핑 조치 완료하였습니다.",
    },
]

// 3가지 상태로 데이터 필터링
const pendingIssues = allIssues.filter((issue) => issue.status === "pending")
const inprogressIssues = allIssues.filter((issue) => issue.status === "inprogress")
const completedIssues = allIssues.filter((issue) => issue.status === "completed")

export default function InspectionStatusPage() {
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">개선 조치 현황</h1>
                <UserProfileBadge roleName="여수 1 관리자" />
            </div>

            <Tabs defaultValue="inprogress" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">
                        개선 필요
                        <Badge variant="destructive" className="ml-2">
                            {pendingIssues.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="inprogress">
                        개선 중
                        <Badge variant="secondary" className="ml-2">
                            {inprogressIssues.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        개선 완료
                        <Badge variant="secondary" className="ml-2">
                            {completedIssues.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                {/* 1. 개선 필요 탭 */}
                <TabsContent value="pending" className="mt-4 space-y-4">
                    {pendingIssues.length > 0 ? (
                        pendingIssues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground p-8">
                            대기 중인 항목이 없습니다.
                        </p>
                    )}
                </TabsContent>

                {/* 2. 개선 중 탭 */}
                <TabsContent value="inprogress" className="mt-4 space-y-4">
                    {inprogressIssues.length > 0 ? (
                        inprogressIssues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground p-8">
                            진행 중인 항목이 없습니다.
                        </p>
                    )}
                </TabsContent>

                {/* 3. 개선 완료 탭 */}
                <TabsContent value="completed" className="mt-4 space-y-4">
                    {completedIssues.length > 0 ? (
                        completedIssues.map((issue) => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground p-8">
                            완료된 항목이 없습니다.
                        </p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}