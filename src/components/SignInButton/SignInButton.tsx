import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './Styles.module.scss'
import { signIn, useSession, signOut } from 'next-auth/react';

export function SignInButton() {
    const {data: session } = useSession();

    return session ? (
        <button onClick={() => signOut()} type="button" className={styles.signInButton}>
            <FaGithub color="#04d361" />
            Sign in with Github
            <FiX color="#737380" className={styles.closeIcon}/>
        </button>
    ): (
        <button onClick={() => signIn("github")} type="button" className={styles.signInButton}>
            <FaGithub color="#eba417" />
            Sign in with Github
        </button>       
    )
}