<?php
$servername = "localhost";
$username = "bbcap23_2";
$password = "F0fG1LOi";
$dbname = "wp_bbcap23_2";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$items = $data['items'];
$order_date = date('Y-m-d H:i:s');

foreach ($items as $item) {
    $itemName = $item['name'];
    $itemPrice = $item['price'];
    $quantity = $item['quantity'];
    $sql = "INSERT INTO `order` (item_name, item_price, quantity, order_date) VALUES ('$itemName', '$itemPrice', '$quantity', '$order_date')";
    if (!$conn->query($sql) === TRUE) {
        echo json_encode(['success' => false, 'error' => $conn->error]);
        $conn->close();
        exit();
    }
}

echo json_encode(['success' => true]);
$conn->close();
?>
