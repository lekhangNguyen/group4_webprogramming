<?php
// Database connection
$servername = "localhost";
$username = "bbcap23_2";
$password = "F0fG1LOi";
$dbname = "wp_bbcap23_2";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// rread input
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['items'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid data received']);
    exit();
}

$items = $data['items'];
$order_date = date('Y-m-d H:i:s');

// iinsert items
foreach ($items as $item) {
    $itemName = $conn->real_escape_string($item['name']);
    $itemPrice = (float)$item['price'];
    $quantity = (int)$item['quantity'];

    $sql = "INSERT INTO order (item_name, item_price, quantity, order_date) 
            VALUES ('$itemName', '$itemPrice', '$quantity', '$order_date')";

    if (!$conn->query($sql)) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $conn->error]);
        $conn->close();
        exit();
    }
}

// Success response
echo json_encode(['success' => true]);
$conn->close();
?>