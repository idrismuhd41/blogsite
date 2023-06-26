import Header from '../../components/Header';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Post } from '../../types/Post';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import PostEditForm from '../../components/PostEditForm';
import usePosts from '../../hooks/usePosts';
import { useRouter } from 'next/router';

type Props = {
  post: Post;
};
const PostPage = ({ post }: Props) => {
  const user = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { updatePost } = usePosts();

  const handleSubmit = async (title: string, body: string) => {
    await updatePost(post.id, title, body);
    router.reload();
  };

  return (
    <>
      <Head>
        <title>Posts list</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Header />
        <Container>
          <Link href='/' legacyBehavior>
            <Button variant='link'>{'<'}Back to all posts</Button>
          </Link>
          {isEditing ? (
            <PostEditForm post={post} saveForm={handleSubmit} />
          ) : (
            <>
              <h1>{post.title}</h1>
              <div>{post.body}</div>
              {user && user.id === post.author && (
                <Button onClick={() => setIsEditing(true)}>Edit post</Button>
              )}
            </>
          )}
        </Container>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', ctx.params?.id)
    .single();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: data,
    },
  };
};

export default PostPage;
