import { useNavigate } from "@solidjs/router";

export default function Home() {
  useNavigate()('/login', {replace: true})
  return (
    <></>
  );
}
