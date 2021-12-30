import StaticServer from 'react-native-static-server';

export default class WebRTE {

  options = {
    port: 1234, // note that 80 is reserved on Android - an exception will be thrown
  };

  server = new StaticServer(this.options.port, { keepAlive : true, localOnly : true });

  start() {

    this.server.start().then((url: string) => {
      console.log("Serving at URL", url);
    });


    // Check if native server running
    // const isRunning = await server.isRunning()

  }

  stop() {
    
    this.server.stop();

  }

}
