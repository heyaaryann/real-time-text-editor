import { Button } from "@/components/ui/button";
const Home =()=>{
  return(
    <div className = "flex min-h-screen items-center justify-center bg-red-500">
      <Button variant="primary">
        Click me
        </Button>
        
    </div>
  );
}
export default Home;
//we have to use erport default at the end , if we doesnt it will show an error
