declare module 'africastalking' {
  interface SMSOptions {
    to: string[];
    message: string;
    from?: string;
  }

  interface SMS {
    send(options: SMSOptions): Promise<any>;
  }

  interface AfricasTalkingOptions {
    apiKey: string;
    username: string;
  }

  interface AfricasTalking {
    SMS: SMS;
  }

  function AfricasTalking(options: AfricasTalkingOptions): AfricasTalking;
  export = AfricasTalking;
}