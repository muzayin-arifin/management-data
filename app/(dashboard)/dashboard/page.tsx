
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap } from "lucide-react";
import { StudentService } from '@/services/studentService';
import { StudentsTable } from "@/components/dashboard/StudentsTable";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch data
  let students: any[] = [];
  let totalStudents = 0;
  let activeMajors = 0;
  
  try {
     students = await StudentService.getAll();
     totalStudents = students.length;
     if (totalStudents > 0) {
        const uniqueMajors = new Set(students.map((s: any) => s.major));
        activeMajors = uniqueMajors.size;
     }
  } catch (e) {
     console.error("Failed to load stats", e);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-slate-900 shadow-xl shadow-indigo-900/20 transition-all hover:shadow-2xl hover:shadow-indigo-900/40 hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-indigo-300">Total Students</CardTitle>
            <div className="p-2 bg-indigo-500/20 rounded-lg">
               <Users className="h-5 w-5 text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-4xl font-bold text-white tracking-tight">{totalStudents}</div>
            <p className="text-xs text-indigo-300/60 mt-2 font-medium">Registered in system</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-900/50 via-slate-900 to-slate-900 shadow-xl shadow-pink-900/20 transition-all hover:shadow-2xl hover:shadow-pink-900/40 hover:-translate-y-1">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-pink-500/10 blur-xl" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-pink-300">Active Majors</CardTitle>
            <div className="p-2 bg-pink-500/20 rounded-lg">
                <GraduationCap className="h-5 w-5 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-4xl font-bold text-white tracking-tight">{activeMajors}</div>
            <p className="text-xs text-pink-300/60 mt-2 font-medium">Across all students</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-1 backdrop-blur-md shadow-2xl">
         <StudentsTable initialData={students} />
      </div>
    </div>
  );
}
