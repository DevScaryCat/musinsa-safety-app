"use client"

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
import { useState } from "react"

// 이 모달은 어떤 점검 항목(itemContent)에 대한 것인지 props로 받습니다.
interface IssueModalProps {
    itemContent: string
    triggerButton: React.ReactNode
    onSave: (data: { comment: string; photo?: File }) => void
}

export function IssueModal({
    itemContent,
    triggerButton,
    onSave,
}: IssueModalProps) {
    const [comment, setComment] = useState("")
    const [photo, setPhoto] = useState<File | undefined>()
    const [isOpen, setIsOpen] = useState(false)

    const handleSave = () => {
        // TODO: Supabase Storage에 사진 업로드 로직 추가
        onSave({ comment, photo })
        setIsOpen(false)
        setComment("")
        setPhoto(undefined)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>지적 사항 기록</DialogTitle>
                    <DialogDescription>{itemContent}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="photo" className="text-right">
                            사진
                        </Label>
                        {/* 모바일에서 카메라를 바로 실행하기 위한 capture 속성 추가 */}
                        <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="col-span-3"
                            onChange={(e) => setPhoto(e.target.files?.[0])}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="comment" className="text-right">
                            내용
                        </Label>
                        <Textarea
                            id="comment"
                            placeholder="예: 점검표 미부착, 작성 관리 미흡"
                            className="col-span-3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            취소
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave}>
                        저장
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}