import { Label, TextInput, Checkbox, Button } from 'flowbite-react';

export default function NewCommissionForm() {
    return (
        <form>
            <div>
                <Label htmlFor='title' value='Commission Title' />
                <TextInput id='title' placeholder='Character drinking tea' required />
            </div>
            <div>
                <Label htmlFor='description' value='Description' />
                {/* Add text field for description */}
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