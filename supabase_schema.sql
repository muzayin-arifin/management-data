-- 1. Tabel Users (Untuk Autentikasi/Login)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Disimpan plain text sesuai kode authService saat ini
  role TEXT DEFAULT 'student',
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabel Students (Data Mahasiswa)
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL, -- NIM (Nomor Induk Mahasiswa)
  name TEXT NOT NULL,
  major TEXT NOT NULL, -- Jurusan
  semester INTEGER NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Data Awal (Seed Data) untuk Admin
INSERT INTO users (email, password, role, name)
VALUES 
  ('admin@example.com', '12345', 'admin', 'Admin System'),
  ('muzayin@example.com', '12345', 'admin', 'Muzayin') -- Username yang diminta sebelumnya
ON CONFLICT (email) DO NOTHING;

-- 4. Data Dummy Mahasiswa (Opsional, untuk tes dashboard)
INSERT INTO students (student_id, name, major, semester, email)
VALUES 
  ('1001', 'Alice Johnson', 'Computer Science', 3, 'alice@example.com'),
  ('1002', 'Budi Santoso', 'Sistem Informasi', 5, 'budi@example.com'),
  ('1003', 'Citra Lestari', 'Teknik Informatika', 1, 'citra@example.com')
ON CONFLICT (student_id) DO NOTHING;
