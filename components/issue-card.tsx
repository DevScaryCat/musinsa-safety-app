"use client"

import * as React from "react"
import Image from "next/image"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, CheckCircle, Clock, Info, Upload } from "lucide-react"

// 이 카드가 받을 데이터의 타입 정의
export interface Issue {
    id: string
    location: string
    area: string
    factor: string
    hazard: string
    before_image: string // '개선 전' 사진 URL (임시로 unsplash 사용)
    before_comment: string // '현장 관리자'가 등록한 내용 (개선 방안)
    status: "pending" | "inprogress" | "completed"
    // '개선 중' 상태일 때만 존재
    top_manager_plan?: string
    // '개선 완료' 상태일 때만 존재
    after_image?: string
    after_comment?: string
}

interface IssueCardProps {
    issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
    // '개선 중' 카드에서 '조치 완료 등록' 버튼을 눌렀을 때 실행될 함수
    const handleCompleteAction = () => {
        // TODO: '개선 후' 사진과 내용을 Supabase에 업로드
        console.log(`[${issue.id}] 조치 완료 처리`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{`${issue.location} - ${issue.area}`}</CardTitle>
                <CardDescription>{`요인: ${issue.factor} / 재해: ${issue.hazard}`}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 1. 개선 전 사진 및 내용 */}
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

                {/* 2. 최종 관리자 개선 방안 ('개선 중' 또는 '완료' 상태일 때) */}
                {issue.top_manager_plan && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>최종 관리자 개선 방안</AlertTitle>
                        <AlertDescription>{issue.top_manager_plan}</AlertDescription>
                    </Alert>
                )}

                {/* 3. 개선 후 사진 및 내용 ('완료' 상태일 때) */}
                {issue.status === "completed" && issue.after_image && (
                    <div>
                        <h4 className="font-semibold mb-2 text-green-600">개선 후 (조치 완료)</h4>
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
            </CardContent>

            {/* 4. 카드 하단 (상태별로 다른 UI 렌더링) */}
            <CardFooter>
                {issue.status === "pending" && (
                    <div className="flex items-center text-sm text-yellow-600">
                        <Clock className="w-4 h-4 mr-2" />
                        최종 관리자 개선 방안 등록 대기 중...
                    </div>
                )}

                {issue.status === "inprogress" && (
                    // '조치 완료 등록' Dialog
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full" size="lg">
                                <Upload className="w-4 h-4 mr-2" /> 조치 완료 등록
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>개선 조치 등록</DialogTitle>
                                <DialogDescription>
                                    '개선 후' 사진과 조치 내용을 등록해 주세요.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="after-photo">개선 후 사진</Label>
                                    <Input
                                        id="after-photo"
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="after-comment">조치 내용</Label>
                                    <Textarea
                                        id="after-comment"
                                        placeholder="예: 지시대로 조치 완료함"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        취소
                                    </Button>
                                </DialogClose>
                                <Button type="button" onClick={handleCompleteAction}>
                                    제출
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}

                {issue.status === "completed" && (
                    <div className="flex items-center text-sm font-semibold text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        개선 완료 (최종 승인)
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}