// import { useRouter } from "next/router";

// import { useEntry } from '@/lib/swr-hooks'
import Container from "@/components/container";

export default function ChannelPage() {
  // const router = useRouter();
  // const id = router.query.id?.toString();
  // const { data } = useEntry(id)
  const data = { title: "Test", content: "Test content" };
  if (data) {
    return (
      <Container>
        <h1 className="font-bold text-3xl my-2">{data.title}</h1>
        <p>{data.content}</p>
      </Container>
    );
  } else {
    return (
      <Container>
        <h1 className="font-bold text-3xl my-2">...</h1>
        <p>...</p>
      </Container>
    );
  }
}
