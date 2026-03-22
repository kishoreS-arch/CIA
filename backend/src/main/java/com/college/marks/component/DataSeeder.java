package com.college.marks.component;

import com.college.marks.entity.*;
import com.college.marks.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private MarkRepository markRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if(userRepository.count() == 0) {
            seedData();
        } else {
            // Fix existing users that may not have linkedId set
            fixLinkedIds();
        }
    }

    private void fixLinkedIds() {
        userRepository.findAll().forEach(user -> {
            if (user.getLinkedId() == null || user.getLinkedId().isEmpty()) {
                user.setLinkedId(user.getUsername());
                userRepository.save(user);
            }
        });
    }

    private void seedData() {
        // Seed Student
        Student s1 = new Student();
        s1.setRegNo("CS2024001");
        s1.setName("S. PRADEEP");
        s1.setDob(LocalDate.of(2002, 5, 20));
        s1.setDepartment("Computer Science Engineering");
        s1.setYear(3);
        s1.setClassSection("A");
        studentRepository.save(s1);

        // Seed Staff
        Staff staff1 = new Staff();
        staff1.setEmpId("EMP101");
        staff1.setName("Dr. John Doe");
        staff1.setDob(LocalDate.of(1980, 1, 15));
        staff1.setDepartment("Computer Science Engineering");
        staff1.setRole(Role.STAFF);
        staffRepository.save(staff1);

        Staff cc1 = new Staff();
        cc1.setEmpId("EMP102");
        cc1.setName("Prof. Jane Smith");
        cc1.setDob(LocalDate.of(1975, 8, 22));
        cc1.setDepartment("Computer Science Engineering");
        cc1.setRole(Role.CC);
        staffRepository.save(cc1);

        Staff hod1 = new Staff();
        hod1.setEmpId("EMP103");
        hod1.setName("Dr. Alan Turing");
        hod1.setDob(LocalDate.of(1965, 3, 10));
        hod1.setDepartment("Computer Science Engineering");
        hod1.setRole(Role.HOD);
        staffRepository.save(hod1);

        // Seed Users with linkedId
        createUser("CS2024001", "20/05/2002", Role.STUDENT, "CS2024001");
        createUser("EMP101", "15/01/1980", Role.STAFF, "EMP101");
        createUser("EMP102", "22/08/1975", Role.CC, "EMP102");
        createUser("EMP103", "10/03/1965", Role.HOD, "EMP103");

        // Seed Subjects
        Subject sub1 = new Subject();
        sub1.setSubjectId("CS301");
        sub1.setSubjectName("Database Management Systems");
        sub1.setClassId("3-A");
        sub1.setDepartment("CSE");
        subjectRepository.save(sub1);

        Subject sub2 = new Subject();
        sub2.setSubjectId("CS302");
        sub2.setSubjectName("Operating Systems");
        sub2.setClassId("3-A");
        sub2.setDepartment("CSE");
        subjectRepository.save(sub2);

        // Seed Marks
        Mark m1 = new Mark();
        m1.setStudent(s1);
        m1.setSubject(sub1);
        m1.setCt1Marks(45);
        m1.setCt2Marks(50);
        m1.setLastUpdatedBy(staff1);
        markRepository.save(m1);

        Mark m2 = new Mark();
        m2.setStudent(s1);
        m2.setSubject(sub2);
        m2.setCt1Marks(25); 
        m2.setCt2Marks(32); 
        m2.setLastUpdatedBy(cc1);
        markRepository.save(m2);
    }

    private void createUser(String username, String rawPassword, Role role, String linkedId) {
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setLinkedId(linkedId);
        userRepository.save(user);
    }
}
