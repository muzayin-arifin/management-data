
"use client"

import { useEffect, useState, useMemo } from "react"
import { StudentManager } from "@/lib/oop/StudentManager"
import { Student, StudentProps } from "@/lib/oop/Student"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StudentForm } from "@/components/forms/StudentForm"
import { Plus, Search, Trash2, Edit, FileJson, Download, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function StudentsPage() {
  const router = useRouter()
  const [studentsData, setStudentsData] = useState<StudentProps[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Algorithm State
  const [searchQuery, setSearchQuery] = useState("")
  const [searchAlgo, setSearchAlgo] = useState<'linear' | 'binary'>('linear')
  const [sortAlgo, setSortAlgo] = useState<'insertion' | 'merge'>('merge')
  const [sortField, setSortField] = useState<'name' | 'student_id'>('name')
  
  // Delete Dialog
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Manager Instance (re-created when data changes to ensure sync)
  const manager = useMemo(() => new StudentManager(studentsData), [studentsData])

  // Fetch initial data
  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/students')
      const data = await res.json()
      if (Array.isArray(data)) {
        setStudentsData(data)
      }
    } catch (e) {
      console.error("Failed to fetch students", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Derived state using algorithms
  const displayStudents = useMemo(() => {
    // 1. Search (Linear or Binary)
    let results: Student[] = []
    if (searchQuery) {
        // Note: For binary search, manager sorts internally or we must ensure sorted.
        // Our manager implementation handles calling binarySearch util which expects sorted array.
        // We trust manager or Utils to handle it.
        // Actually our Manager implementation does: returns list
        results = manager.search(searchQuery, searchAlgo)
    } else {
        results = manager.getStudents()
    }

    // 2. Sort (Insertion or Merge)
    // We create a temp manager or stick to results array if we want strictly array manip,
    // but we want to use the OOP Manager's method `sortByAlgorithm`.
    // However, `sortByAlgorithm` sorts *all* students in manager if implemented directly, or returns sorted copy.
    // Our implementation of `sortByAlgorithm` returns a sorted array copy.
    // So we should sort the `results` array.
    // But `manager.sortByAlgorithm` uses `this.students`.
    // So maybe we should just use the manager to get sorted list IF no search query?
    // Or we should update manager with search results?
    
    // Logic: If search is active, show search results. Sort search results?
    // Search algorithms usually return specific matches.
    // If we want to sort the *view*, we can use the utils directly here or add method to manager.
    // For simplicity:
    // If query exists -> show search results (raw).
    // If no query -> show sorted list from Manager.
    
    if (searchQuery) return results;

    return manager.sortByAlgorithm(sortField, sortAlgo);
  }, [manager, searchQuery, searchAlgo, sortAlgo, sortField])

  // Handlers
  const handleCreate = async (data: any) => {
    try {
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed");
        await fetchStudents();
        setIsOpen(false);
    } catch (e) {
        alert("Error creating student");
    }
  }

  const handleUpdate = async (data: any) => {
    if (!editingId) return;
    try {
        const res = await fetch(`/api/students/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed");
        await fetchStudents();
        setEditingId(null);
        setIsOpen(false);
    } catch (e) {
        alert("Error updating student");
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
        await fetch(`/api/students/${deleteId}`, { method: 'DELETE' });
        await fetchStudents();
        setDeleteId(null);
    } catch (e) {
        alert("Error deleting");
    }
  }

  const handleExport = () => {
    const json = manager.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.json';
    a.click();
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const json = event.target?.result as string;
            // Validate via manager locally first?
            const tempManager = new StudentManager([]);
            tempManager.loadFromJSON(json); // throws if invalid
            const newStudents = tempManager.getStudents();
            
            // Bulk insert via API (loop for now or bulk endpoint)
            // For simplicity, simple loop.
            // Warn: slow for large data.
            let count = 0;
            for (const s of newStudents) {
               await fetch('/api/students', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(s.toJSON())
               }); // Ignoring duplicates/errors for demo speed
               count++;
            }
            alert(`Imported ${count} students`);
            fetchStudents();
        } catch (err) {
            alert("Invalid JSON file");
        }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Students</h2>
           <p className="text-slate-400">Manage student data with advanced algorithms</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleExport} className="border-slate-700 text-slate-300 hover:bg-slate-800">
             <Download className="mr-2 h-4 w-4" /> Export JSON
           </Button>
           <div className="relative">
             <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 pointer-events-none absolute inset-0 w-full h-full opacity-0">
               Import
             </Button>
             <label className="flex items-center justify-center h-9 px-4 py-2 border border-slate-700 rounded-md text-sm font-medium hover:bg-slate-800 cursor-pointer text-slate-300 transition-colors">
                 <Upload className="mr-2 h-4 w-4" /> Import JSON
                 <input type="file" accept=".json" className="hidden" onChange={handleImport} />
             </label>
           </div>
           
           <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) setEditingId(null); }}>
             <DialogTrigger asChild>
               <Button className="bg-indigo-600 hover:bg-indigo-700">
                 <Plus className="mr-2 h-4 w-4" /> Add Student
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
               <DialogHeader>
                 <DialogTitle>{editingId ? 'Edit Student' : 'Add New Student'}</DialogTitle>
               </DialogHeader>
               <StudentForm 
                  initialData={editingId ? studentsData.find(s => s.id === editingId) : undefined} 
                  onSubmit={editingId ? handleUpdate : handleCreate}
                  onCancel={() => setIsOpen(false)}
               />
             </DialogContent>
           </Dialog>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
         <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
               <Input 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-950 border-slate-700 text-slate-100"
               />
            </div>
            <Select value={searchAlgo} onValueChange={(v: any) => setSearchAlgo(v)}>
              <SelectTrigger className="w-[140px] bg-slate-950 border-slate-700 text-slate-100">
                 <SelectValue placeholder="Algo" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="linear">Linear Search</SelectItem>
                 <SelectItem value="binary">Binary Search</SelectItem>
              </SelectContent>
            </Select>
         </div>
         
         <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-400">Sort By:</span>
            <Select value={sortField} onValueChange={(v: any) => setSortField(v)}>
              <SelectTrigger className="w-[120px] bg-slate-950 border-slate-700 text-slate-100">
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="name">Name</SelectItem>
                 <SelectItem value="student_id">Student ID</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortAlgo} onValueChange={(v: any) => setSortAlgo(v)}>
              <SelectTrigger className="w-[140px] bg-slate-950 border-slate-700 text-slate-100">
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="insertion">Insertion Sort</SelectItem>
                 <SelectItem value="merge">Merge Sort</SelectItem>
              </SelectContent>
            </Select>
         </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-800 overflow-hidden">
         <Table>
            <TableHeader className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
              <TableRow className="border-slate-800 hover:bg-slate-900/50 transition-colors">
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-400 pl-4 py-4">NIM</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-400">Name</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-400">Major</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-400 text-center">Sem</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-400">IPK</TableHead>
                <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-400">Email</TableHead>
                <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-slate-400 pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
             {loading ? (
                <TableRow>
                   <TableCell colSpan={7} className="h-24 text-center text-slate-400">Loading...</TableCell>
                </TableRow>
             ) : displayStudents.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={7} className="h-24 text-center text-slate-400">No students found.</TableCell>
                </TableRow>
             ) : (
                displayStudents.map((student) => (
                  <TableRow key={student.id} className="border-slate-800/50 hover:bg-slate-800/50 transition-colors group">
                    <TableCell className="font-mono text-xs pl-4">
                       <span className="bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
                           {student.student_id}
                       </span>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-3">
                           <Avatar className="h-8 w-8 border border-slate-700">
                               <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                               <AvatarFallback className="bg-indigo-900 text-indigo-200 text-xs">
                                   {student.name.substring(0,2).toUpperCase()}
                               </AvatarFallback>
                           </Avatar>
                           <span className="font-medium text-slate-200">{student.name}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                           {student.major}
                       </span>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className="text-slate-300 font-medium">{student.semester}</span>
                    </TableCell>
                    <TableCell>
                       <span className={`font-medium ${student.ipk >= 3.5 ? 'text-emerald-400' : student.ipk >= 3.0 ? 'text-blue-400' : 'text-yellow-400'}`}>
                           {student.ipk.toFixed(2)}
                       </span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm max-w-[150px] truncate" title={student.email}>
                       {student.email}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-indigo-400 hover:bg-indigo-500/10" onClick={() => { setEditingId(student.id); setIsOpen(true); }}>
                              <Edit className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteId(student.id)}>
                              <Trash2 className="h-4 w-4" />
                           </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
             )}
           </TableBody>
         </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete the student record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}