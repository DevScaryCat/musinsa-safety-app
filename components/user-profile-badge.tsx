"use client" // Link 컴포넌트 사용을 위해 명시

import { UserCircle } from "lucide-react"
import Link from "next/link" // next/link import

interface UserProfileBadgeProps {
    roleName: string
}

export function UserProfileBadge({ roleName }: UserProfileBadgeProps) {
    // [수정] 역할에 따라 이동할 경로를 설정합니다.
    let href = "/" // 기본 경로

    if (roleName === "여수 1 관리자") {
        href = "/inspection/status"
    } else if (roleName === "최고 관리자") {
        href = "/dashboard"
    }

    return (
        // [수정] Link 컴포넌트로 감싸고, 클릭 가능하도록 스타일을 추가합니다.
        <Link href={href}>
            <div className="flex items-center space-x-2 rounded-full bg-gray-100 p-2 pr-4 cursor-pointer hover:bg-gray-200 transition-colors">
                <UserCircle className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">{roleName}</span>
            </div>
        </Link>
    )
}