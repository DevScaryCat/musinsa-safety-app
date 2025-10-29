"use client"

import { SearchableSelect } from "@/components/searchable-select"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserProfileBadge } from "@/components/user-profile-badge"

// --- Mock Data ---
const centers = ["여수1", "여수2", "여수3", "여수4", "RC"]
const floorsByCenter: Record<string, string[]> = {
    "여수1": ["1F", "2F", "3F"],
    "여수2": ["1F", "B1"],
    "여수3": ["1F", "2F", "3F", "4F"],
    "여수4": ["1F", "2F", "B1", "B2"],
    "RC": ["1F", "2F", "3F"],
}
const areasByFloor: Record<string, string[]> = {
    "1F": ["도크 전반", "입고 구역", "휴게실"],
    "2F": ["RFID 라인", "피킹 구역 A", "메자닌"],
    "3F": ["패킹 구역", "반품 처리실", "사무실"],
    "B1": ["냉동 창고", "기계실"],
    "4F": ["옥상 휴게소", "설비 구역"],
    "B2": ["주차장", "창고 B"],
}
// --- End Mock Data ---

// Local storage key for floor memory
const LAST_FLOOR_KEY = "lastSelectedFloor"
const LAST_CENTER_KEY = "lastSelectedCenter" // Added to make floor memory more reliable

export default function InspectionStartPage() {
    const router = useRouter()
    const [centerLabel, setCenterLabel] = useState("")
    const [floorLabel, setFloorLabel] = useState("")
    const [areaLabel, setAreaLabel] = useState("")

    const currentFloors = floorsByCenter[centerLabel] || []
    const currentAreas = areasByFloor[floorLabel] || []

    // Load last selections on mount
    useEffect(() => {
        const lastCenter = localStorage.getItem(LAST_CENTER_KEY)
        const lastFloor = localStorage.getItem(LAST_FLOOR_KEY)

        // Only restore floor if the center is also the same
        if (lastCenter && centers.includes(lastCenter)) {
            setCenterLabel(lastCenter)
            if (lastFloor && (floorsByCenter[lastCenter] || []).includes(lastFloor)) {
                setFloorLabel(lastFloor)
            }
        }
    }, [])

    // Handle center change
    const handleCenterChange = (selectedCenter: string) => {
        setCenterLabel(selectedCenter)
        setFloorLabel("") // Reset floor
        setAreaLabel("") // Reset area
        localStorage.setItem(LAST_CENTER_KEY, selectedCenter) // Remember center
        localStorage.removeItem(LAST_FLOOR_KEY) // Clear floor memory when center changes
    }

    // Handle floor change
    const handleFloorChange = (selectedFloor: string) => {
        setFloorLabel(selectedFloor)
        setAreaLabel("") // Reset area
        localStorage.setItem(LAST_FLOOR_KEY, selectedFloor) // Remember floor
    }

    // Handle inspection start
    const handleStartInspection = () => {
        if (centerLabel && floorLabel && areaLabel) {
            router.push(
                `/inspection/perform?center=${centerLabel}&floor=${floorLabel}&area=${areaLabel}`,
            )
        } else {
            alert("센터, 층, 세부 위치를 모두 선택하세요.")
        }
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">순회 점검 시작</h1>
                <UserProfileBadge roleName="여수 1 관리자" />
            </div>

            <Card className="w-full">
                <CardHeader>
                    <CardDescription>
                        점검할 위치를 순서대로 선택하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* 1. Center Selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="center-select">센터</Label>
                        <SearchableSelect
                            value={centerLabel}
                            onValueChange={handleCenterChange}
                            placeholder="센터를 선택하세요"
                            items={centers}
                        />
                    </div>

                    {/* 2. Floor Selection (Enabled when center is selected) */}
                    <div className="grid gap-2">
                        <Label htmlFor="floor-select" className={!centerLabel ? "text-muted-foreground" : ""}>
                            층
                        </Label>
                        <SearchableSelect
                            value={floorLabel}
                            onValueChange={handleFloorChange}
                            placeholder="층을 선택하세요"
                            items={currentFloors}
                            disabled={!centerLabel}
                        />
                    </div>

                    {/* 3. Area Selection (Enabled when floor is selected) */}
                    <div className="grid gap-2">
                        <Label htmlFor="area-select" className={!floorLabel ? "text-muted-foreground" : ""}>
                            세부 위치
                        </Label>
                        <SearchableSelect
                            value={areaLabel}
                            onValueChange={setAreaLabel}
                            placeholder="세부 위치를 선택하세요"
                            items={currentAreas}
                            disabled={!floorLabel}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleStartInspection}
                        className="w-full"
                        size="lg"
                        disabled={!centerLabel || !floorLabel || !areaLabel}
                    >
                        점검 시작
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}