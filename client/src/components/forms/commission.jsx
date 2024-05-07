import { Label, TextInput, Textarea, Checkbox, Button } from 'flowbite-react';

export default function CommissionForm() {
    return (
        <form>
            <div>
                <Label htmlFor='title' value='Commission Title' />
                <TextInput id='title' placeholder='E.g. Character drinking tea' required />
            </div>
            <div>
                <Label htmlFor='description' value='Description' />
                <Textarea id='description' placeholder='Write a detailed description of what you want the commission to be about.' rows={8} />
            </div>
            <div>
                <fieldset>
                    {/* Add components for SKU selection here */}
                </fieldset>
            </div>
            <div>
                <fieldset>
                    <div>
                        <Label htmlFor='privateRequest' value='I wish for my commission to be private' />
                        <Checkbox id='privateRequest' helperText={
                            <>
                                Private commissions will not be published to the gallery.
                            </>
                        }/>
                    </div>
                    <div>
                        <Label htmlFor='anonRequest' value='I wish for my commission to be anonymous' />
                        <Checkbox id='anonRequest' helperText={
                            <>
                                Your display name will not be shown when published to the gallery.
                            </>
                        }/>
                    </div>
                </fieldset>
            </div>
            <Button type="submit">Create Request</Button>
        </form>
    );
}