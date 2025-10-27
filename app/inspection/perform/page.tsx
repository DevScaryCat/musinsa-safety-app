"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Camera, CheckCircle, AlertTriangle } from "lucide-react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { SearchableSelect } from "@/components/searchable-select"
import { UserProfileBadge } from "@/components/user-profile-badge"

const FACTORS = [
    "조도", "운반차량", "물품", "휴게시설", "지게차", "콘센트",
    "중량물", "통로", "계단", "안전보건표지", "컨베이어", "흡연",
    "보호구", "기타", "게시판", "커터칼",
]
const HAZARD_TYPES = [
    "맞음", "부딪힘", "떨어짐", "끼임", "기타", "화재", "권고",
    "근골격계질환", "넘어짐", "무너짐", "베임",
]

interface MockIssue {
    id: string
    location: string
    area: string
    factor: string
    plan: string
    date: string
}
const MOCK_EXISTING_ISSUES: MockIssue[] = [
    {
        id: "existing-1",
        location: "1C A 2F",
        area: "도크 전반",
        factor: "물품",
        plan: "방화셔터, 방화문 범위 내 적치 금지",
        date: "2025-10-25",
    },
    {
        id: "existing-2",
        location: "1C A 2F",
        area: "도크 전반",
        factor: "물품",
        plan: "소화전 주변 물품 적치 금지",
        date: "2025-10-24",
    },
    {
        id: "existing-3",
        location: "1C B 3F",
        area: "RFID 라인",
        factor: "지게차",
        plan: "펜스 구분 구획 및 통로 라인 테이핑",
        date: "2025-10-23",
    },
]

function PerformForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const location = searchParams.get("location") || "알 수 없는 위치"
    const area = searchParams.get("area") || "알 수 없는 구역"
    const [photo, setPhoto] = useState<File | undefined>()
    const [preview, setPreview] = useState<string | null>(null)
    const [factor, setFactor] = useState("")
    const [hazardType, setHazardType] = useState("")
    const [plan, setPlan] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [existingIssues, setExistingIssues] = useState<MockIssue[]>([])
    const [isDuplicateAlertOpen, setIsDuplicateAlertOpen] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setPhoto(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleFactorChange = (selectedFactor: string) => {
        setFactor(selectedFactor)

        if (selectedFactor) {
            const duplicates = MOCK_EXISTING_ISSUES.filter(
                (issue) =>
                    issue.location === location &&
                    issue.area === area &&
                    issue.factor === selectedFactor,
            )

            if (duplicates.length > 0) {
                setExistingIssues(duplicates)
                setIsDuplicateAlertOpen(true)
            }
        }
    }

    const handleSubmit = () => {
        console.log("제출 데이터:", {
            location,
            area,
            photo,
            factor,
            hazardType,
            plan,
        })
        setIsSubmitted(true)
    }

    const handleReset = () => {
        setIsSubmitted(false)
        setPhoto(undefined)
        setPreview(null)
        setFactor("")
        setHazardType("")
        setPlan("")
    }

    const handleComplete = () => {
        router.push("/inspection/start")
    }

    if (isSubmitted) {
        return (
            <div className="p-4 max-w-2xl mx-auto space-y-4">
                <div className="flex justify-end">
                    <UserProfileBadge roleName="여수 1 관리자" />
                </div>
                <Alert variant="default" className="border-green-500">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-lg font-bold">
                        성공적으로 제출되었습니다
                    </AlertTitle>
                    <AlertDescription>
                        {location} - {area} 구역의 점검 사항이 등록되었습니다.
                    </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleComplete} variant="outline" size="lg">
                        완료
                    </Button>
                    <Button onClick={handleReset} size="lg">
                        같은 위치 재 점검
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
            <Dialog open={isDuplicateAlertOpen} onOpenChange={setIsDuplicateAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                            유사/중복 기록 확인
                        </DialogTitle>
                        <DialogDescription>
                            현재 위치/구역에 대해 동일한 '요인'으로 등록된
                            최근 기록입니다. 중복 등록이 아닌지 확인해 주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="my-4 max-h-60 overflow-y-auto space-y-4">
                        {existingIssues.map((issue) => (
                            <div key={issue.id} className="border p-3 rounded-md bg-gray-50">
                                <p className="font-semibold">{issue.plan}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    (등록일: {issue.date})
                                </p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsDuplicateAlertOpen(false)}>
                            확인
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex justify-end">
                <UserProfileBadge roleName="여수 1 관리자" />
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-bold">위험 요인 등록</h1>
                <h2 className="text-lg text-muted-foreground">
                    {location} - {area}
                </h2>
            </div>
            <div className="space-y-4">
                {/* 1. 사진 업로드 */}
                <div className="grid gap-2">
                    <Label htmlFor="photo">사진 첨부</Label>
                    <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Label
                        htmlFor="photo"
                        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md h-64 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                    >
                        {preview ? (
                            <Image
                                src={preview}
                                alt="미리보기"
                                width={250}
                                height={250}
                                className="object-contain h-full w-full"
                            />
                        ) : (
                            <>
                                <Camera className="w-12 h-12 mb-2" />
                                <span>터치하여 사진 촬영 또는 업로드</span>
                            </>
                        )}
                    </Label>
                </div>
                {/* 2. 요인 선택 */}
                <div className="grid gap-2">
                    <Label htmlFor="factor">요인</Label>
                    <SearchableSelect
                        value={factor}
                        onValueChange={handleFactorChange}
                        placeholder="위험 요인을 선택하세요"
                        items={FACTORS}
                    />
                </div>
                {/* 3. 재해 유형 선택 */}
                <div className="grid gap-2">
                    <Label htmlFor="hazardType">재해 유형</Label>
                    <SearchableSelect
                        value={hazardType}
                        onValueChange={setHazardType}
                        placeholder="예상 재해 유형을 선택하세요"
                        items={HAZARD_TYPES}
                    />
                </div>
                {/* 4. 개선 방안 */}
                <div className="grid gap-2">
                    <Label htmlFor="plan">개선 방안</Label>
                    <Textarea
                        id="plan"
                        placeholder="예: 통로 라인 테이핑, 경고 표지 부착 관리"
                        rows={5}
                        value={plan}
                        // [수정] e.targe -> e.target 오타 수정
                        onChange={(e) => setPlan(e.target.value)}
                    />
                </div>
                {/* 5. 제출 버튼 */}
                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="lg"
                    disabled={!factor || !hazardType || !plan || !photo}
                >
                    제출하기
                </Button>
            </div>
        </div>
    )
}

export default function InspectionPerformPage() {
    return (
        <Suspense fallback={<div className="p-4">페이지를 불러오는 중...</div>}>
            <PerformForm />
        </Suspense>
    )
}