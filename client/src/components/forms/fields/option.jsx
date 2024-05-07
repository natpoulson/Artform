import { Label, Radio } from 'flowbite-react';

export default function Option(optionType = 'sku'||'addon') {
    const skus = [];
    let skuCounter = 0;

    switch (optionType) {
        case 'addon':
            return (
                <>
                    <fieldset>
                        {/* TODO: Write up component logic for an addon */}
                    </fieldset>
                </>
            );
        case 'sku':
            return (
                <>
                    <fieldset>
                        <legend>Options</legend>
                        {skus.forEach(sku => (
                            <div>
                                <Radio id={`sku-${skuCounter}`} />
                                <Label htmlFor={`sku-${skuCounter}`} value={sku.label} />
                            </div>
                        )(skuCounter++))} {/* Should increment the counter after returning the item for unique labelling */}
                    </fieldset>
                </>
            );
        default:
            return (<></>);
    }

    
}