import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = "."

class CuttingEdgeHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve static files directly
        if self.path.startswith("/static/") or self.path.startswith("/Media/"):
            super().do_GET()
            return

        # Map URL paths to template files
        path_map = {
            "/": "home.html",
            "/approach": "approach.html",
            "/projects": "projects.html",
            "/contact": "contact.html",
            "/project/1": "project_detail.html",
            "/project/4": "project_detail.html",
            "/project/10": "project_detail.html",
        }

        # Normalize path (remove trailing slash if not root)
        clean_path = self.path.rstrip("/") if len(self.path) > 1 else self.path
        
        if clean_path in path_map:
            template_name = path_map[clean_path]
            self.serve_template(template_name)
        else:
            # Fallback or 404 - for now redirect to home or show 404
            # If it looks like a file extension, try to serve it
            if "." in clean_path:
                super().do_GET()
            else:
                self.send_error(404, "Page not found")

    def serve_template(self, template_name):
        try:
            # Extract project ID if this is a project detail page
            project_id = None
            if self.path.startswith("/project/"):
                project_id = self.path.split("/")[-1]
            
            # Read the specific page content
            with open(f"templates/{template_name}", "r") as f:
                content = f.read()
            
            # Replace project placeholders if it's a project detail page
            if project_id:
                # Define project data
                projects_data = {
                    "1": {"name": "Private Residence", "category": "Concept Design", "images": ["2.jpg"]},
                    "4": {"name": "Hospitality Collection", "category": "Turn-key Build", 
                          "images": ["Bar_2_1.jpg", "DSC04834.JPG", "DSC04892 - Copy.JPG", "DSC04895 - Copy.JPG", "DSC05138.JPG"]},
                    "10": {"name": "Modern Architecture", "category": "Full Service", 
                           "images": ["BB933208-1A40-473A-B634-98E2700157F4.JPG", "IMG_0717.jpg", "IMG_0718.jpg"]},
                }
                
                if project_id in projects_data:
                    project = projects_data[project_id]
                    content = content.replace("{{ project_id }}", project_id)
                    content = content.replace("{{ project_name }}", project["name"])
                    content = content.replace("{{ project_category }}", project["category"])
                    
                    # Build images HTML
                    images_html = ""
                    for img in project["images"]:
                        images_html += f'<div class="project-detail-image"><img src="/Media/{project_id}/{img}" alt="{project["name"]}" loading="lazy"></div>\n'
                    content = content.replace("{{ project_images }}", images_html)

            # Check for HTMX request
            if self.headers.get("HX-Request"):
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
            else:
                # Full page load: Wrap in base.html
                with open("templates/base.html", "r") as f:
                    base = f.read()
                
                full_page = base.replace("{{ content }}", content)
                
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(full_page.encode("utf-8"))
                
        except FileNotFoundError:
            self.send_error(404, f"Template {template_name} not found")
        except Exception as e:
            self.send_error(500, str(e))

if __name__ == "__main__":
    # Ensure we are serving from the correct directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CuttingEdgeHandler) as httpd:
        print(f"Serving CuttingEdge at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
