"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// [수정] 데이터 타입을 정의하고, props로 데이터를 받도록 변경
export interface IssueData {
    id: string
    date: string
    location: string
    area: string
    factor: string
    hazard: string
    status: "pending" | "completed"
}

interface IssueDataTableProps {
    data: IssueData[]
}

export function IssueDataTable({ data }: IssueDataTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>점검일</TableHead>
                    <TableHead>센터/층수</TableHead>
                    <TableHead>세부 위치</TableHead>
                    <TableHead>요인</TableHead>
                    <TableHead>재해 유형</TableHead>
                    <TableHead>개선 상태</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* [수정] mockIssues 대신 props.data를 사용 */}
                {data.map((issue) => (
                    <TableRow key={issue.id}>
                        <TableCell>{issue.date}</TableCell>
                        <TableCell>{issue.location}</TableCell>
                        <TableCell>{issue.area}</TableCell>
                        <TableCell>{issue.factor}</TableCell>
                        <TableCell>{issue.hazard}</TableCell>
                        <TableCell>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${issue.status === "pending"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                            >
                                {issue.status === "pending" ? "개선 필요" : "개선 완료"}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}