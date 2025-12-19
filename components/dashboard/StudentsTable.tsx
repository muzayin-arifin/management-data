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
  Card,
  CardContent,
  CardHeader, 
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StudentForm } from "@/components/forms/StudentForm"
import { Plus, Search, Trash2, Edit, Download, Upload, SlidersHorizontal, ArrowRight, Database, FileText, FileJson } from "lucide-react"
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function StudentsTable({ initialData }: { initialData: StudentProps[] }) {
  const [studentsData, setStudentsData] = useState<StudentProps[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Sorting State for Card Controls
  const [sortField, setSortField] = useState<'name' | 'student_id'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Active Sort Configuration
  const [activeSort, setActiveSort] = useState<{
    algo: 'insertion' | 'shell',
    field: 'name' | 'student_id',
    direction: 'asc' | 'desc'
  }>({ algo: 'insertion', field: 'name', direction: 'asc' })

  // Search
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearch, setActiveSearch] = useState<{ query: string, algo: 'linear' | 'binary' } | null>(null)
  const [searchAlgorithm, setSearchAlgorithm] = useState<'linear' | 'binary'>('linear')
  
  // Delete Dialog
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Manager Instance
  const manager = useMemo(() => new StudentManager(studentsData), [studentsData])

  // Fetch students
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

  // Derived state using algorithms
  const displayStudents = useMemo(() => {
    // Search takes precedence
    if (activeSearch && activeSearch.query) {
       return manager.search(activeSearch.query, activeSearch.algo);
    }

    // Default Sorting
    return manager.sortByAlgorithm(activeSort.field, activeSort.algo, activeSort.direction);
  }, [manager, activeSearch, activeSort])

  // Handlers
  const handleSort = (algorithm: 'insertion' | 'shell') => {
      // Clear search when sorting
      setActiveSearch(null); 
      setSearchQuery("");
      
      setActiveSort({
          algo: algorithm,
          field: sortField,
          direction: sortDirection
      });
  }

  const handleSearch = () => {
      if (!searchQuery.trim()) {
          setActiveSearch(null);
          return;
      }
      setActiveSearch({
          query: searchQuery,
          algo: searchAlgorithm
      });
  }

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

  const handleExportJSON = () => {
    const json = manager.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.json';
    a.click();
  }

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("Student Data Report", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Data
    const tableData = displayStudents.map((s, index) => [
        index + 1,
        s.student_id,
        s.name,
        s.major,
        s.semester,
        s.email
    ]);

    autoTable(doc, {
        head: [['No', 'NIM', 'Name', 'Major', 'Sem', 'Email']],
        body: tableData,
        startY: 40,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [79, 70, 229] } // Indigo 600
    });

    doc.save("students-report.pdf");
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const json = event.target?.result as string;
            const tempManager = new StudentManager([]);
            tempManager.loadFromJSON(json);
            const newStudents = tempManager.getStudents();
            
            let count = 0;
            for (const s of newStudents) {
               await fetch('/api/students', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(s.toJSON())
               });
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
    <div className="space-y-6 text-slate-100 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Student Data</h2>
           <p className="text-slate-400 font-medium">Manage and organize your student records</p>
        </div>
        <div className="flex gap-3">
           <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) setEditingId(null); }}>
             <DialogTrigger asChild>
               <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105">
                 <Plus className="mr-2 h-4 w-4" /> Add Student
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[425px] bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-xl shadow-2xl">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sorting & Search Control Card (2/3 width) */}
          <Card className="lg:col-span-2 border-0 bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg font-medium flex items-center gap-2 text-indigo-300">
                <SlidersHorizontal className="h-5 w-5" />
                Algorithm Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm">
                
                {/* Sort Section */}
                <div className="mb-6 pb-6 border-b border-slate-800/50">
                  <h3 className="text-slate-200 font-semibold mb-3">Sort Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column */}
                    <div className="space-y-3">
                      <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider">Column</Label>
                      <RadioGroup value={sortField} onValueChange={(v: any) => setSortField(v)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="name" id="sort-name" />
                          <Label htmlFor="sort-name">Name</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="student_id" id="sort-nim" />
                          <Label htmlFor="sort-nim">NIM</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Direction */}
                    <div className="space-y-3">
                      <Label className="text-slate-400 uppercase text-xs font-bold tracking-wider">Direction</Label>
                      <RadioGroup value={sortDirection} onValueChange={(v: any) => setSortDirection(v)} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="asc" id="sort-asc" />
                          <Label htmlFor="sort-asc">Asc</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="desc" id="sort-desc" />
                          <Label htmlFor="sort-desc">Desc</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Execution */}
                    <div className="flex items-end gap-2">
                      <Button onClick={() => handleSort('insertion')} variant="outline" size="sm" className="flex-1 bg-slate-900/50 border-slate-700">Insertion</Button>
                      <Button onClick={() => handleSort('shell')} size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700">Shell Sort</Button>
                    </div>
                  </div>
                </div>

                {/* Search Section */}
                <div>
                  <h3 className="text-slate-200 font-semibold mb-3">Search Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Algorithm</Label>
                           <RadioGroup value={searchAlgorithm} onValueChange={(v: any) => setSearchAlgorithm(v)} className="flex gap-4">
                               <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="linear" id="algo-linear" />
                                  <Label htmlFor="algo-linear">Linear Search</Label>
                                </div>
                               <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="binary" id="algo-binary" />
                                  <Label htmlFor="algo-binary">Binary Search (NIM)</Label>
                               </div>
                           </RadioGroup>
                        </div>
                        <div className="flex items-end gap-2">
                           <div className="relative w-full">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                <Input 
                                    className="pl-9 bg-slate-950/50 border-slate-800" 
                                    placeholder={searchAlgorithm === 'binary' ? "Search NIM..." : "Search Name..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    // Enter key trigger
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                           </div>
                           <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700 min-w-[80px]">
                                Search
                           </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Data Management Card (1/3 width) */}
          <Card className="lg:col-span-1 border-0 bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden">
             <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
             <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg font-medium flex items-center gap-2 text-indigo-300">
                    <Database className="h-5 w-5" />
                    Data Management
                </CardTitle>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <Button variant="outline" onClick={handleExportJSON} className="w-full border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/10 h-20 flex flex-col gap-2">
                        <FileJson className="h-6 w-6 text-yellow-500" /> 
                        <span>Export JSON</span>
                    </Button>
                    <Button variant="outline" onClick={handleExportPDF} className="w-full border-slate-700 bg-slate-900/50 backdrop-blur-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/10 h-20 flex flex-col gap-2">
                        <FileText className="h-6 w-6 text-red-500" /> 
                        <span>Export PDF</span>
                    </Button>
                </div>
                
                <div className="relative w-full">
                    <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 bg-slate-900/30 backdrop-blur-sm rounded-lg hover:bg-slate-800/50 cursor-pointer text-slate-400 hover:text-white transition-all hover:shadow-lg hover:border-indigo-500/50 group h-24">
                        <Upload className="h-6 w-6 mb-2 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium">Import Data (JSON)</span>
                        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                    </label>
                </div>
             </CardContent>
          </Card>
      </div>

      {/* Results Info Bar */}
      {activeSearch && (
          <div className="flex items-center justify-between p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
              <span className="text-sm">
                  Showing results for <strong>"{activeSearch.query}"</strong> using <strong>{activeSearch.algo === 'binary' ? 'Binary Search' : 'Linear Search'}</strong>
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setActiveSearch(null); setSearchQuery(""); }}
                className="hover:bg-indigo-500/20"
              >
                Reset Search
              </Button>
          </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-2xl shadow-black/40">
         <Table>
           <TableHeader className="bg-slate-950/80 backdrop-blur-sm">
             <TableRow className="border-slate-800 hover:bg-transparent">
               <TableHead className="text-indigo-300 font-semibold w-[120px]">NIM</TableHead>
               <TableHead className="text-indigo-300 font-semibold">Name</TableHead>
               <TableHead className="text-indigo-300 font-semibold">Major</TableHead>
               <TableHead className="text-indigo-300 font-semibold w-[80px]">Sem</TableHead>
               <TableHead className="text-indigo-300 font-semibold">Email</TableHead>
               <TableHead className="text-right text-indigo-300 font-semibold w-[100px]">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        Loading data...
                      </div>
                   </TableCell>
                </TableRow>
             ) : displayStudents.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-32 text-center text-slate-400 bg-slate-900/20">
                      No students found matching criteria.
                   </TableCell>
                </TableRow>
             ) : (
                displayStudents.map((student, index) => (
                  <TableRow 
                    key={student.id} 
                    className="border-slate-800/50 hover:bg-slate-800/40 transition-colors even:bg-slate-900/20"
                  >
                    <TableCell className="font-mono text-slate-300">{student.student_id}</TableCell>
                    <TableCell className="font-medium text-slate-200">{student.name}</TableCell>
                    <TableCell className="text-slate-300">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                        {student.major}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300 text-center">{student.semester}</TableCell>
                    <TableCell className="text-slate-300 text-center font-mono text-xs">{student.ipk?.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{student.email}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-1">
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
        <AlertDialogContent className="bg-slate-950/95 border-slate-800 text-slate-100 backdrop-blur-xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Student?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
