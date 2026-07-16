import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';


class PayFineScreen extends StatefulWidget {


  final String paymentUrl;


  const PayFineScreen({
    super.key,
    required this.paymentUrl
  });


  @override
  State<PayFineScreen> createState()
  => _PayFineScreenState();

}



class _PayFineScreenState
    extends State<PayFineScreen>{


  late WebViewController controller;



  @override
  void initState(){

    super.initState();


    controller =
    WebViewController()

      ..setJavaScriptMode(
          JavaScriptMode.unrestricted
      )


      ..setNavigationDelegate(

          NavigationDelegate(

              onPageStarted:(url){

                print(
                    "START $url"
                );

              },


              onPageFinished:(url){

                print(
                    "FINISH $url"
                );

              },


              onWebResourceError:(error){

                print(
                    error.description
                );

              },


              onNavigationRequest:(request){


                print(
                    request.url
                );



                if(request.url.contains(
                    "return"
                )){


                  Navigator.pop(
                      context,
                      true
                  );


                  return NavigationDecision.prevent;


                }


                if(request.url.contains(
                    "cancel"
                )){


                  Navigator.pop(
                      context,
                      false
                  );


                  return NavigationDecision.prevent;

                }



                return NavigationDecision.navigate;

              }

          )

      )


      ..loadRequest(
          Uri.parse(
              widget.paymentUrl
          )
      );

  }



  @override
  Widget build(BuildContext context){


    return Scaffold(

        appBar:AppBar(
          title:
          const Text(
              "Pay Fine"
          ),
        ),


        body:
        WebViewWidget(
            controller:controller
        )

    );

  }


}