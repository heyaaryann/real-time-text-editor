
import Link from "next/link";

const Home = () => {
  return ( 
    <div className="flex min-h-screen items-center justify-center">

      <div className="text-black italic">
        WELCOME AND CLICK HERE TO GO TO ---<br />

      </div>
       
      <Link href="documents/123">
      <span className="text-blue-500 underline">&nbsp;Real-time-text-editor&nbsp;</span>
      </Link> 
    </div>
   );
}
 
export default Home;