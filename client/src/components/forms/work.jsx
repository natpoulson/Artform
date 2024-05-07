import { Label, Button, TextInput, Textarea, Checkbox } from 'flowbite-react';

export default function WorkForm() {
    const isPublished = false; // Will add a check to this later

    return (
        <form>
            <div>
                <Label htmlFor='title' value='Title' />
                <TextInput id='title' placeholder='Title to be shown when viewing this item.' required />
            </div>
            <div>
                <Label htmlFor='description' value='Description' />
                <Textarea id='description' placeholder='Write a description for people viewing this item.' rows={8} />
            </div>
            <fieldset>
                <div>
                    <Label htmlFor='publish' value='Publish in Works gallery' />
                    <Checkbox id='publish' helperText={
                        <>
                            You can&apos;t publish works to the gallery if your commissioner has requested a private commission.
                        </>
                    } />
                </div>
                <div>
                    <Label htmlFor='featured' value='Add to Featured Works' />
                    <Checkbox id='featured' helperText={
                        <>
                            Featured works are shown at the top of your gallery in the carousel.
                        </>
                    } />
                </div>
            </fieldset>
            <Button type="submit">{isPublished ? 'Update' : 'Publish'}</Button>
        </form>
    );
}