package com.college.marks.controller;

import com.college.marks.entity.*;
import com.college.marks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @GetMapping
    public ResponseEntity<?> getProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        String linkedId = user.getLinkedId() != null ? user.getLinkedId() : username;

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("username", username);
        profile.put("role", user.getRole().name());

        if (user.getRole() == Role.STUDENT) {
            Student student = studentRepository.findById(linkedId).orElse(null);
            if (student != null) {
                profile.put("name", student.getName());
                profile.put("regNo", student.getRegNo());
                profile.put("department", student.getDepartment());
                profile.put("year", student.getYear());
                profile.put("classSection", student.getClassSection());
                profile.put("dob", student.getDob());
            }
        } else {
            Staff staff = staffRepository.findById(linkedId).orElse(null);
            if (staff != null) {
                profile.put("name", staff.getName());
                profile.put("empId", staff.getEmpId());
                profile.put("department", staff.getDepartment());
                profile.put("dob", staff.getDob());
            }
        }

        return ResponseEntity.ok(profile);
    }
}
