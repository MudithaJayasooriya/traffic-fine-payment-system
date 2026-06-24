class Fine {

  final String referenceNumber;
  final String categoryName;
  final double amount;
  final String status;
  final int officerId;
  final int driverId;

  Fine({
    required this.referenceNumber,
    required this.categoryName,
    required this.amount,
    required this.status,
    required this.officerId,
    required this.driverId,
  });

  factory Fine.fromJson(Map<String,dynamic> json){

    return Fine(
      referenceNumber: json["referenceNumber"],
      categoryName: json["categoryName"],
      amount: json["amount"].toDouble(),
      status: json["status"],
      officerId: json["officerId"],
      driverId: json["driverId"],
    );
  }
}