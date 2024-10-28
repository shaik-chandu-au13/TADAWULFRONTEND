import http.server
import json
import subprocess
import os
from urllib.parse import urlparse, parse_qs
from http.server import BaseHTTPRequestHandler

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)

        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('home_page.html', 'rb') as f:
                self.wfile.write(f.read())

        elif self.path == '/home_page.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('home_page.html', 'rb') as f:
                self.wfile.write(f.read())

        elif self.path == '/index.css':
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            with open('index.css', 'rb') as f:
                self.wfile.write(f.read())

        elif self.path == '/dashboard.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('dashboard.html', 'rb') as f:
                self.wfile.write(f.read())
        elif self.path == '/admin.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('admin.html', 'rb') as f:
                self.wfile.write(f.read())

        elif self.path == '/dashboard.css':
            self.send_response(200)
            self.send_header('Content-type', 'text/css')
            self.end_headers()
            with open('dashboard.css', 'rb') as f:
                self.wfile.write(f.read())

        elif self.path == '/index.js':
            self.send_response(200)
            self.send_header('Content-type', 'text/javascript')
            self.end_headers()
            with open('index.js', 'rb') as f:
                self.wfile.write(f.read())

        elif self.path == '/dashboard.js':
            self.send_response(200)
            self.send_header('Content-type', 'text/javascript')
            self.end_headers()
            with open('dashboard.js', 'rb') as f:
                self.wfile.write(f.read())
        
        elif self.path == '/json.js':
            self.send_response(200)
            self.send_header('Content-type', 'text/javascript')
            self.end_headers()
            with open('json.js', 'rb') as f:
                self.wfile.write(f.read())

        elif self.path == '/output.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Load JSON data from a file and send it as a response
            with open('output.json', 'r') as json_file:
                data = json_file.read()
            self.wfile.write(data.encode('utf-8'))

        elif self.path == '/thisJSONcreatesHomepage.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            # Load JSON data from a file and send it as a response
            with open('thisJSONcreatesHomepage.json', 'r') as json_file:
                data = json_file.read()
            self.wfile.write(data.encode('utf-8'))

        elif self.path.startswith('/images/'):
            image_path = self.path[1:]
            if os.path.exists(image_path):
                self.send_response(200)
                self.send_header('Content-type', 'image/jpeg')  # Adjust content type as needed
                self.end_headers()
                with open(image_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Image not found')

        elif parsed_url.path == '/run-java' and 'modulename' in query_params: 
            modulename = query_params['modulename'][0]
            batch_files = {
                'home page': r'C:\\Users\\12267\\Downloads\\LatestTSE\\saudiexchange\\demo.bat'
                #'UnlistedCorporateSukuk':r'C:\\Users\\12267\\Downloads\\saudiexchange\\Demo1.bat',
            }

            batch_file = batch_files.get(modulename)
 
            if batch_file:
                cmd_command = f'cmd /c {batch_file}'  # Use "cmd /c" to run the batch file.

                execute_process = subprocess.Popen(cmd_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                execute_stdout, execute_stderr = execute_process.communicate()

                if execute_process.returncode != 0:
                    error_msg = execute_stderr.decode()
                    print('Execution Error:', error_msg)
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'error': error_msg}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    output_msg = execute_stdout.decode()
                    print('CMD Output:', output_msg)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'output': output_msg}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
            else:
                error_msg = f'Batch file not found for modulename: {modulename}'
                print('Error:', error_msg)
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': error_msg}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'error': 'Invalid request'}
            self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_POST(self):
        print(f"Received POST request for path: {self.path}")  # Debugging line
        if self.path == '/update-json':
            print("Entering update-json handler")  # Debugging line
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')

            try:
                print("Loading new JSON data...")  # Debugging line
                
                # Parse the incoming data (this will be the new complete data)
                new_data = json.loads(post_data)
                print("New data to save:", new_data)  # Debugging line

                # Write the new data to the file, overwriting existing data
                with open('thisJSONcreatesHomepage.json', 'w') as json_file:
                    json.dump(new_data, json_file, indent=4)

                self.send_response(200)
                self.end_headers()
                response = {'message': 'Data replaced successfully'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                print("Data replaced successfully")  # Debugging line
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                print(f"Error: {e}")  # Debugging line
                response = {'error': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()


if __name__ == '__main__':
    from http.server import HTTPServer
    server_address = ('localhost', 8082)
    httpd = HTTPServer(server_address, MyHandler) # type: ignore
    print('Starting server...')
    httpd.serve_forever()
