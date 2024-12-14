import { redirect } from 'next/navigation';

export default function CatchAllAuth({ params }: { params: { slug?: string[] } }) {
  if (!params.slug || params.slug.join('/') === 'login') {
    redirect('/auth/farmer/login');
  }
}