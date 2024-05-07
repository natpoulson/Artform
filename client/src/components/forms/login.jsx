import { Button, Label, TextInput } from 'flowbite-react';

export default function LoginForm() {
    return (
        <form>
            <div>
                <Label htmlFor='email' value='Email Address' />
                <TextInput id='email' placeholder='username@example.com' type='email' required />
            </div>
            <div>
                <Label htmlFor='password' value='Password' />
                <TextInput id='password' type='password' required />
            </div>
            <Button type='submit' value='Log in' />
        </form>
    );
}