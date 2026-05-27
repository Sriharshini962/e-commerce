<?php
header('Content-Type: application/json');

$conn = mysqli_connect('localhost', 'root', '', 'urbanmart_db');

if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = $_POST['fullname'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $password = $_POST['password'] ?? '';
    $gender = $_POST['gender'] ?? '';
    
    if (empty($fullname)) {
        $response['message'] = 'Name is required';
    } elseif (empty($email)) {
        $response['message'] = 'Email is required';
    } elseif (empty($password)) {
        $response['message'] = 'Password is required';
    } elseif (strlen($password) < 4) {
        $response['message'] = 'Password must be 4+ characters';
    } else {
        $check = mysqli_query($conn, "SELECT id FROM users WHERE email = '$email'");
        
        if (mysqli_num_rows($check) > 0) {
            $response['message'] = 'Email already exists';
        } else {
            $sql = "INSERT INTO users (fullname, email, phone, password, gender) 
                    VALUES ('$fullname', '$email', '$phone', '$password', '$gender')";
            
            if (mysqli_query($conn, $sql)) {
                $response['success'] = true;
                $response['message'] = 'Registration successful!';
            } else {
                $response['message'] = 'Registration failed';
            }
        }
    }
}

mysqli_close($conn);
echo json_encode($response);
?>