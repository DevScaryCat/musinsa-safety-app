"use client"

import * as React from "react"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Issue } from "@/components/issue-card"
import { Info, CheckCircle, Clock } from "lucide-react"

interface IssueDetailModalProps {
    issue: Issue
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdatePlan: (issueId: string, plan: string) => void
}

export function IssueDetailModal({
    issue,
    open,
    onOpenChange,
    onUpdatePlan,
}: IssueDetailModalProps) {
    // 최고 관리자가 입력할 개선 방안
    const [plan, setPlan] = React.useState("")

    const handleSubmit = () => {
        onUpdatePlan(issue.id, plan)
        setPlan("") // 폼 리셋
    }

    // 모달이 열릴 때마다 폼 리셋 (필요시)
    React.useEffect(() => {
        if (open) {
            setPlan("")
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{`${issue.location} - ${issue.area}`}</DialogTitle>
                    <DialogDescription>
                        {`요인: ${issue.factor} / 재해: ${issue.hazard} / 등록일: ${issue.date}`}
                    </DialogDescription>
                    <div>
                        {issue.status === "pending" && (
                            <Badge variant="destructive">개선 필요</Badge>
                        )}
                        {issue.status === "inprogress" && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                개선 중
                            </Badge>
                        )}
                        {issue.status === "completed" && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                개선 완료
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto space-y-4 p-4">
                    {/* 1. 개선 전 정보 */}
                    <div>
                        <h4 className="font-semibold mb-2">개선 전 (현장 등록)</h4>
                        <Image
                            src={issue.before_image}
                            alt="개선 전 사진"
                            width={400}
                            height={300}
                            className="rounded-md object-cover w-full h-48"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            {issue.before_comment}
                        </p>
                    </div>

                    {/* 2. 최고 관리자 개선 방안 (상태별 분기) */}
                    {issue.status === "pending" && (
                        <div className="space-y-2">
                            <Label htmlFor="top-manager-plan" className="font-semibold">
                                최종 관리자 개선 방안
                            </Label>
                            <Textarea
                                id="top-manager-plan"
                                placeholder="예: 즉시 '추락주의' 경고 표지 부착 관리 바람."
                                rows={4}
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                            />
                        </div>
                    )}

                    {/* '개선 중' 또는 '완료' 상태면 등록된 방안을 보여줌 */}
                    {issue.status !== "pending" && issue.top_manager_plan && (
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>최종 관리자 개선 방안</AlertTitle>
                            <AlertDescription>{issue.top_manager_plan}</AlertDescription>
                        </Alert>
                    )}

                    {/* 3. 개선 후 정보 (완료 상태일 때) */}
                    {issue.status === "completed" && issue.after_image && (
                        <div>
                            <h4 className="font-semibold mb-2 text-green-600">
                                개선 후 (조치 완료)
                            </h4>
                            <Image
                                src={issue.after_image}
                                alt="개선 후 사진"
                                width={400}
                                height={300}
                                className="rounded-md object-cover w-full h-48"
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                                {issue.after_comment}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        닫기
                    </Button>
                    {/* '개선 필요' 상태일 때만 '개선 지시' 버튼 활성화 */}
                    {issue.status === "pending" && (
                        <Button onClick={handleSubmit} disabled={!plan}>
                            개선 지시 등록
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}