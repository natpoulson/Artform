import { Label, TextInput, Button } from 'flowbite-react';

export default function RegisterForm() {
    return (
        <form>
            <div>
                <Label htmlFor='displayName' value='Email Address' />
                <TextInput id='displayName' placeholder='New User' type='email' required />
            </div>
            <div>
                <Label htmlFor='email' value='Email Address' />
                <TextInput id='email' placeholder='username@example.com' type='email' required />
            </div>
            <div>
                <Label htmlFor='password' value='Password' />
                <TextInput id='password' type='password' required />
            </div>
            <Button type='submit' value='Register' />
        </form>
    );
}