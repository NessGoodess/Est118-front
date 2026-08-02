import StudentDetailSkeleton, {
  StudentPhotoSkeleton,
} from "@/features/students/components/detail/StudentDetailSkeleton";
import ContentLayout from "@/components/ui/ContentLayout";
import GenericHeaderSkeleton from "@/components/ui/skeleton/GenericHeaderSkeleton";

export default function LoadingStudentProfile() {
  return (
    <>
      <GenericHeaderSkeleton />
      <ContentLayout className="mt-6" side={<StudentPhotoSkeleton />}>
        <StudentDetailSkeleton />
      </ContentLayout>
    </>
  );
}
