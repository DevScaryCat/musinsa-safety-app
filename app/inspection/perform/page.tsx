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
import { DatePicker } from "@/components/ui/date-picker"


const FACTORS = [
    "조도", "운반차량", "물품", "휴게시설", "지게차", "콘센트",
    "중량물", "통로", "계단", "안전보건표지", "컨베이어", "흡연",
    "보호구", "기타", "게시판", "커터칼",
]
const HAZARD_TYPES = [
    "맞음", "부딪힘", "떨어짐", "끼임", "기타", "화재", "권고",
    "근골격계질환", "넘어짐", "무너짐", "베임",
]

interface MockIssuePerform {
    id: string
    center: string
    floor: string
    area: string
    factor: string
    plan: string
    date: string
}
const MOCK_EXISTING_ISSUES: MockIssuePerform[] = [
    {
        id: "existing-1",
        center: "여수1",
        floor: "2F",
        area: "도크 전반",
        factor: "물품",
        plan: "방화셔터, 방화문 범위 내 적치 금지",
        date: "2025-10-25",
    },
    {
        id: "existing-2",
        center: "여수1",
        floor: "2F",
        area: "도크 전반",
        factor: "물품",
        plan: "소화전 주변 물품 적치 금지",
        date: "2025-10-24",
    },
    {
        id: "existing-3",
        center: "여수1",
        floor: "3F",
        area: "RFID 라인",
        factor: "지게차",
        plan: "펜스 구분 구획 및 통로 라인 테이핑",
        date: "2025-10-23",
    },
]



function PerformForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const center = searchParams.get("center") || "알 수 없는 센터"
    const floor = searchParams.get("floor") || "알 수 없는 층"
    const area = searchParams.get("area") || "알 수 없는 구역"

    const [photos, setPhotos] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [factor, setFactor] = useState("")
    const [hazardType, setHazardType] = useState("")
    const [plan, setPlan] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [inspectionDate, setInspectionDate] = useState<Date | undefined>(new Date())
    const [standard, setStandard] = useState<string | null>(null)

    const [existingIssues, setExistingIssues] = useState<MockIssuePerform[]>([])
    const [isDuplicateAlertOpen, setIsDuplicateAlertOpen] = useState(false)


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setPhotos(prev => [...prev, ...filesArray]);

            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }

        e.target.value = '';
    };


    const handleRemovePhoto = (indexToRemove: number) => {
        setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
        setPreviews(prev => {
            const urlToRemove = prev[indexToRemove];
            if (urlToRemove) {
                URL.revokeObjectURL(urlToRemove);
            }
            return prev.filter((_, index) => index !== indexToRemove);
        });
    };


    const handleFactorChange = (selectedFactor: string) => {
        setFactor(selectedFactor)


        if (selectedFactor === "물품") {
            setStandard("물품 적재 기준: 통로 확보, 소화전/비상구 주변 적치 금지, 랩핑 상태 확인")
        } else if (selectedFactor === "지게차") {
            setStandard("지게차 점검 기준: 작업 전 점검표 작성, 안전벨트 착용, 운전자 외 탑승 금지")
        } else {
            setStandard(null);
        }

        if (selectedFactor) {
            const duplicates = MOCK_EXISTING_ISSUES.filter(
                (issue) =>
                    issue.center === center &&
                    issue.floor === floor &&
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
            center,
            floor,
            area,
            photos,
            factor,
            hazardType,
            plan,
            inspectionDate: inspectionDate?.toISOString().split('T')[0],
        })
        setIsSubmitted(true)
    }

    const handleReset = () => {
        setIsSubmitted(false)
        setPhotos([])
        setPreviews([])
        setFactor("")
        setHazardType("")
        setPlan("")
        setInspectionDate(new Date())
        setStandard(null)
    }

    const handleComplete = () => {
        router.push("/inspection/start")
    }

    if (isSubmitted) {
        return (
            <div className="p-4 max-w-2xl mx-auto space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">제출 완료</h1>
                    <UserProfileBadge roleName="여수 1 관리자" />
                </div>
                <Alert variant="default" className="border-green-500">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-lg font-bold">
                        성공적으로 제출되었습니다
                    </AlertTitle>
                    <AlertDescription>
                        {center} - {floor} - {area} 구역 ({inspectionDate?.toLocaleDateString()}) 점검 사항 등록 완료.
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
                                    ({issue.center}-{issue.floor}-{issue.area} / 등록일: {issue.date})
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

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">위험 요인 등록</h1>
                <UserProfileBadge roleName="여수 1 관리자" />
            </div>

            <div className="text-center -mt-4 mb-4">
                <h2 className="text-lg text-muted-foreground">
                    {center} - {floor} - {area}
                </h2>
            </div>

            {/* Date Picker */}
            <div className="grid gap-2">
                <Label htmlFor="inspection-date">점검 날짜</Label>
                {/* Needs a DatePicker component, using shadcn/ui example structure */}
                {/* Assuming you have created/installed components/ui/date-picker.tsx */}
                {/* <DatePicker date={inspectionDate} onDateChange={setInspectionDate} /> */}
                {/* Simple input for now if DatePicker is not ready */}
                <Input
                    type="date"
                    value={inspectionDate ? inspectionDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setInspectionDate(e.target.value ? new Date(e.target.value) : undefined)}
                />
            </div>


            <div className="space-y-4">
                {/* 1. Multiple Photo Upload */}
                <div className="grid gap-2">
                    <Label htmlFor="photo">사진 첨부 (여러 장 가능)</Label>
                    <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {/* Photo Previews and Add Button */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {previews.map((previewUrl, index) => (
                            <div key={index} className="relative w-24 h-24 border rounded">
                                <Image
                                    src={previewUrl}
                                    alt={`미리보기 ${index + 1}`}
                                    fill
                                    sizes="6rem"
                                    className="object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none -mt-1 -mr-1 hover:bg-red-700"
                                    aria-label="Remove image"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <Label
                            htmlFor="photo"
                            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md w-24 h-24 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
                        >
                            <Camera className="w-8 h-8 mb-1" />
                            <span className="text-xs">사진 추가</span>
                        </Label>
                    </div>
                </div>

                {/* 2. Factor Selection */}
                <div className="grid gap-2">
                    <Label htmlFor="factor">요인</Label>
                    <SearchableSelect
                        value={factor}
                        onValueChange={handleFactorChange}
                        placeholder="위험 요인을 선택하세요"
                        items={FACTORS}
                    />
                </div>

                {/* Standard Display Area */}
                {standard && (
                    <Alert variant="default">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>점검 기준</AlertTitle>
                        <AlertDescription>
                            {standard}
                        </AlertDescription>
                    </Alert>
                )}


                {/* 3. Hazard Type Selection */}
                <div className="grid gap-2">
                    <Label htmlFor="hazardType">재해 유형</Label>
                    <SearchableSelect
                        value={hazardType}
                        onValueChange={setHazardType}
                        placeholder="예상 재해 유형을 선택하세요"
                        items={HAZARD_TYPES}
                    />
                </div>

                {/* 4. Improvement Plan */}
                <div className="grid gap-2">
                    <Label htmlFor="plan">개선 방안 (현장 조치 내용)</Label>
                    <Textarea
                        id="plan"
                        placeholder="예: 통로 라인 테이핑, 경고 표지 부착 관리"
                        rows={5}
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                    />
                </div>

                {/* 5. Submit Button */}
                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    size="lg"

                    disabled={!factor || !hazardType || !plan || photos.length === 0 || !inspectionDate}
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