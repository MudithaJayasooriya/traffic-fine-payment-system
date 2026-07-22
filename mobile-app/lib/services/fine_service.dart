import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/fine.dart';
import '../services/api_service.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class FineService {
  final String baseUrl = "http://localhost:8080/api";

  Future<Fine?> createFine(
    String categoryCode,
    int officerId,
    int driverId,
    String district,
  ) async {
    final token = await ApiService.getToken();

    final response = await http.post(
      Uri.parse("$baseUrl/fines"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "categoryCode": categoryCode,
        "officerId": officerId,
        "driverId": driverId,
        "district": district,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return Fine.fromJson(jsonDecode(response.body));
    }

    return null;
  }

  Future<Fine?> searchFine(String referenceNumber) async {
    final response = await http.get(
      Uri.parse("$baseUrl/fines/$referenceNumber"),
    );

    if (response.statusCode == 200) {
      return Fine.fromJson(jsonDecode(response.body));
    }

    return null;
  }

  Future<List<Fine>> getDriverFines() async {
    final token = await ApiService.getToken();
    if (token == null) {
      print("FineService: No security token found.");
      return [];
    }

    try {
      // 1. Decode JWT to dynamically discover the logged-in driver's ID
      Map<String, dynamic> decodedToken = JwtDecoder.decode(token);

      // Fallback matching logic for common backend claim keys ('id' or 'userId')
      int? driverId = decodedToken['id'] ?? decodedToken['userId'];

      if (driverId == null) {
        print("FineService: Driver ID key missing from JWT token claims.");
        return [];
      }

      // 2. Perform the GET request passing the Authorization Bearer token header
      final response = await http.get(
        Uri.parse("$baseUrl/fines/driver/$driverId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization":
              "Bearer $token", // This was missing and caused the issue!
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((fine) => Fine.fromJson(fine)).toList();
      } else {
        print(
          "FineService Backend Error: HTTP status code ${response.statusCode}",
        );
      }
    } catch (e) {
      print("Error fetching driver fines from backend service: $e");
    }
    return [];
  }

  Future<List<Fine>> getOfficerFines() async {
    final token = await ApiService.getToken();
    if (token == null) {
      print("FineService getOfficerFines: No JWT token found.");
      return [];
    }

    try {
      Map<String, dynamic> decodedToken = JwtDecoder.decode(token);
      final rawId = decodedToken['id'] ?? decodedToken['userId'];
      final int? officerId = rawId != null ? int.tryParse(rawId.toString()) : null;

      print("FineService getOfficerFines: Token parsed officerId = $officerId (raw: $rawId)");

      if (officerId == null) {
        print("FineService getOfficerFines: Officer ID could not be extracted from token.");
        return [];
      }

      final response = await http.get(
        Uri.parse("$baseUrl/fines/officer/$officerId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      print("FineService getOfficerFines HTTP ${response.statusCode}: ${response.body}");

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((fine) => Fine.fromJson(fine)).toList();
      }
    } catch (e) {
      print("Error fetching officer fines: $e");
    }
    return [];
  }

  Future<Fine?> updateFine(int id, String categoryCode, int driverId) async {
    final token = await ApiService.getToken();

    final response = await http.put(
      Uri.parse("$baseUrl/fines/$id"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "categoryCode": categoryCode,
        "driverId": driverId,
      }),
    );

    if (response.statusCode == 200) {
      return Fine.fromJson(jsonDecode(response.body));
    }
    return null;
  }

  Future<bool> deleteFine(int id) async {
    final token = await ApiService.getToken();

    final response = await http.delete(
      Uri.parse("$baseUrl/fines/$id"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    return response.statusCode == 200;
  }

  Future<List<dynamic>> getAllCategories() async {
    final response = await http.get(Uri.parse("$baseUrl/categories"));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  // SEARCH CATEGORIES
  // Used when typing in search box
  Future<List<dynamic>> searchCategories(String keyword) async {
    final String url = "$baseUrl/categories/search?keyword=$keyword";

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  Future<List<dynamic>> getAllDrivers() async {
    final response = await http.get(Uri.parse("$baseUrl/users/drivers"));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  Future<List<dynamic>> getAllOfficers() async {
    final response = await http.get(Uri.parse("$baseUrl/users/officers"));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  // GET USER BY ID (OFFICER)
  Future<Map<String, dynamic>?> getUserById(int id) async {
    final response = await http.get(
      Uri.parse("$baseUrl/users/$id"),
      headers: {"Content-Type": "application/json"},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return null;
  }

  Future<List<dynamic>> searchUsers(String keyword) async {
    final response = await http.get(
      Uri.parse("$baseUrl/users/search?keyword=$keyword"),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    return [];
  }

  Future<Map<String, dynamic>?> initiatePayment(
    String referenceNumber,
    double amount,
    int fineId,
  ) async {
    final token = await ApiService.getToken();

    // Get the actual fine ID from backend first
    final fineResponse = await http.get(
      Uri.parse("$baseUrl/fines/$referenceNumber"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (fineResponse.statusCode != 200) {
      print("Could not fetch fine details");
      return null;
    }

    final fineData = jsonDecode(fineResponse.body);
    print("Fine data: $fineData");

    // Now initiate payment with correct data
    final response = await http.post(
      Uri.parse("$baseUrl/payments/initiate"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "fineId": fineId, // ← real fine ID from DB
        "amount": amount,
        "firstName": "Driver",
        "lastName": "User",
        "email": "driver@trafficfine.gov",
        "phone": "0771234567",
        "address": "Main Road",
        "city": "Colombo",
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return null;
  }

  Future<bool> markFineAsPaid(String referenceNumber) async {
    final token = await ApiService.getToken();

    final response = await http.put(
      Uri.parse("$baseUrl/fines/$referenceNumber/mark-paid"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    return response.statusCode == 200;
  }
}
