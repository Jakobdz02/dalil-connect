import { PageWrapper } from "@/components/layout/PageWrapper";

export default function GuidePublicProfile({ id }: { id: string }) {
  return (
    <PageWrapper showFooter>
      <h1 className="font-display text-4xl text-primary py-10">Guide #{id}</h1>
    </PageWrapper>
  );
}
