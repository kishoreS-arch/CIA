package com.college.marks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.marks.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
