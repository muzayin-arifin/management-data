
"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { studentSchema, StudentProps } from "@/lib/oop/Student"
import { Loader2 } from "lucide-react"

interface StudentFormProps {
  initialData?: StudentProps
  onSubmit: (data: z.infer<typeof studentSchema>) => Promise<void>
  onCancel: () => void
}

export function StudentForm({ initialData, onSubmit, onCancel }: StudentFormProps) {
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      name: "",
      student_id: "",
      major: "",
      semester: 1,
      email: ""
    },
  })

  // Loading state handling inside onSubmit wrapper in parent or here?
  // Use isSubmitting form state
  const { isSubmitting, errors } = form.formState

  const handleSubmit = async (data: z.infer<typeof studentSchema>) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...form.register("name")} placeholder="John Doe" />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="student_id">Student ID (NIM)</Label>
        <Input id="student_id" {...form.register("student_id")} placeholder="12345" disabled={!!initialData} />
        {errors.student_id && <p className="text-destructive text-sm">{errors.student_id.message}</p>}
        {initialData && <p className="text-xs text-muted-foreground">ID cannot be changed</p>}
      </div>

      <div className="grid gap-2">
         <Label htmlFor="email">Email</Label>
         <Input id="email" {...form.register("email")} placeholder="john@example.com" />
         {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
            <Label htmlFor="major">Major</Label>
            <Controller
              control={form.control}
              name="major"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <SelectTrigger id="major" className="bg-slate-950/50 border-slate-800 text-slate-100">
                    <SelectValue placeholder="Select Major" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                    <SelectItem value="Informatika">Informatika</SelectItem>
                    <SelectItem value="Hukum">Hukum</SelectItem>
                    <SelectItem value="Akuntansi">Akuntansi</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.major && <p className="text-destructive text-sm">{errors.major.message}</p>}
        </div>
        <div className="grid gap-2">
            <Label htmlFor="semester">Semester</Label>
            <Input 
                id="semester" 
                type="number" 
                {...form.register("semester", { valueAsNumber: true })} 
                min={1} 
                max={14} 
            />
            {errors.semester && <p className="text-destructive text-sm">{errors.semester.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
}
