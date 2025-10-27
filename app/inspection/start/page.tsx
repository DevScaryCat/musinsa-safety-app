"use client"

import { SearchableSelect } from "@/components/searchable-select"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
// [추가] 새로 만든 사용자 배지 컴포넌트
import { UserProfileBadge } from "@/components/user-profile-badge"

const locations = ["1C A 1F", "1C A 2F", "1C A 3F", "1C B 1F", "1C B 2F", "1C B 3F", "2C"]
const areas = ["도크 전반", "RFID 라인", "파렛트랙", "메자닌 개구부", "컨베이어"]

export default function InspectionStartPage() {
    const router = useRouter()
    const [locationLabel, setLocationLabel] = useState("")
    const [areaLabel, setAreaLabel] = useState("")

    const handleStartInspection = () => {
        if (locationLabel && areaLabel) {
            router.push(
                `/inspection/perform?location=${locationLabel}&area=${areaLabel}`,
            )
        } else {
            alert("센터/층수와 세부 위치를 모두 선택하세요.")
        }
    }

    return (
        <div className="p-4 h-screen bg-gray-50">
            {/* [추가] 페이지 상단에 사용자 배지 추가 */}
            <div className="flex justify-end mb-4">
                <UserProfileBadge roleName="여수 1 관리자" />
            </div>

            <div className="flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>순회 점검 시작</CardTitle>
                        <CardDescription>
                            점검할 위치를 선택하세요.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="location-center">센터 및 층수</Label>
                            <SearchableSelect
                                value={locationLabel}
                                onValueChange={setLocationLabel}
                                placeholder="센터/층수를 선택하세요"
                                items={locations}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location-area">세부 위치</Label>
                            <SearchableSelect
                                value={areaLabel}
                                onValueChange={setAreaLabel}
                                placeholder="세부 위치를 선택하세요"
                                items={areas}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleStartInspection}
                            className="w-full"
                            size="lg"
                            disabled={!locationLabel || !areaLabel}
                        >
                            점검 시작
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}