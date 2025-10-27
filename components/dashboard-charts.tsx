"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

// 1. 재해 유형별 Mock Data
const hazardData = [
    { name: "부딪힘", 지적건수: 59 },
    { name: "맞음", 지적건수: 36 },
    { name: "권고", 지적건수: 33 },
    { name: "끼임", 지적건수: 28 },
    { name: "넘어짐", 지적건수: 17 },
    { name: "화재", 지적건수: 16 },
    { name: "근골격계", 지적건수: 9 },
    { name: "떨어짐", 지적건수: 8 },
    { name: "기타", 지적건수: 5 },
    { name: "무너짐", 지적건수: 4 },
    { name: "베임", 지적건수: 1 },
]

// 2. 요인별 Mock Data (Top 10)
const factorData = [
    { name: "물품", 지적건수: 56 },
    { name: "지게차", 지적건수: 45 },
    { name: "안전보건표지", 지적건수: 27 },
    { name: "컨베이어", 지적건수: 22 },
    { name: "기타", 지적건수: 11 },
    { name: "보호구", 지적건수: 10 },
    { name: "운반차량", 지적건수: 10 },
    { name: "통로", 지적건수: 9 },
    { name: "콘센트", 지적건수: 5 },
    { name: "휴게시설", 지적건수: 4 },
].sort((a, b) => a.지적건수 - b.지적건수) // 가로 차트를 위해 오름차순 정렬

// 3. 장소별 Mock Data (Top 10)
const locationData = [
    { name: "1C A 3F", 지적건수: 34 },
    { name: "2C", 지적건수: 27 },
    { name: "1C A 2F", 지적건수: 24 },
    { name: "1C B 3F", 지적건수: 22 },
    { name: "3C 2B", 지적건수: 17 },
    { name: "1C B 2F", 지적건수: 14 },
    { name: "3C 1B", 지적건수: 13 },
    { name: "1C A 1F", 지적건수: 12 },
    { name: "3C 3F", 지적건수: 9 },
    { name: "4C 2B", 지적건수: 8 },
].sort((a, b) => a.지적건수 - b.지적건수) // 가로 차트를 위해 오름차순 정렬

// 차트 1: 재해 유형별 (세로 막대 차트)
export function HazardTypeChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hazardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* [수정] 찐한 빨강(#ef4444) -> 부드러운 빨강(#f87171) */}
                <Bar dataKey="지적건수" fill="#f87171" />
            </BarChart>
        </ResponsiveContainer>
    )
}

// 차트 2: 위험 요인별 (가로 막대 차트)
export function FactorChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                <Tooltip />
                <Legend />
                {/* [수정] 찐한 주황(#f97316) -> 부드러운 주황(#fb923c) */}
                <Bar dataKey="지적건수" fill="#fb923c" />
            </BarChart>
        </ResponsiveContainer>
    )
}

// 차트 3: 장소별 (가로 막대 차트)
export function LocationChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                <Tooltip />
                <Legend />
                {/* [수정] 찐한 파랑(#3b82f6) -> 부드러운 파랑(#60a5fa) */}
                <Bar dataKey="지적건수" fill="#60a5fa" />
            </BarChart>
        </ResponsiveContainer>
    )
}