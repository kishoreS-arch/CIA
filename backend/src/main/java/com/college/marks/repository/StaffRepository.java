package com.college.marks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.marks.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, String> {
}
