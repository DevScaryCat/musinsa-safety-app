"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface SearchableSelectProps {
    items: string[] // 선택 항목 목록 (문자열 배열)
    value: string // 현재 선택된 값
    onValueChange: (value: string) => void // 값 변경 시 호출될 함수
    placeholder?: string // 플레이스홀더
}

export function SearchableSelect({
    items,
    value,
    onValueChange,
    placeholder = "항목 선택...",
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)

    // items를 Combobox가 요구하는 { value, label } 형태로 변환
    const options = items.map((item) => ({
        value: item,
        label: item,
    }))

    const selectedLabel =
        options.find((option) => option.value === value)?.label || placeholder

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="truncate">{selectedLabel}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="검색..." />
                    <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value} // value를 사용해야 CommandInput의 검색이 작동함
                                    onSelect={(currentValue) => {
                                        // currentValue는 선택된 항목의 value (소문자/공백 처리될 수 있음)
                                        // 실제 items 배열에서 원본 값을 찾아 onValueChange에 전달
                                        const originalValue =
                                            items.find(
                                                (item) =>
                                                    item.toLowerCase() === currentValue.toLowerCase(),
                                            ) || ""
                                        onValueChange(originalValue === value ? "" : originalValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}