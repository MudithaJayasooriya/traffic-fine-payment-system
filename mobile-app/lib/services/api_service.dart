import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {

  static const String baseUrl = "http://10.0.2.2:8080/api";

  static Future<http.Response> post(
      String endpoint,
      Map<String, dynamic> data,
      ) async {
    return await http.post(
      Uri.parse(baseUrl + endpoint),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(data),
    );
  }

  static Future<http.Response> get(String endpoint) async {
    return await http.get(Uri.parse(baseUrl + endpoint));
  }
}