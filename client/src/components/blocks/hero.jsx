import { Avatar } from 'flowbite-react';

export default function Hero(imgBanner, imgProfile) {
    return (
        <section className={`bg-center bg-no-repeat ${imgBanner && "bg-[url](" + "data:image/webp;base64," + imgBanner.serialCompressed + ")"} bg-gray-700 bg-blend-multiply`}>
            <div className={`px-4 mx-auto max-w-screen-xl text-center ${imgBanner ? 'py-24 lg:py-56' : 'py-10 lg:py-20'} flex justify-end`}>
                {() => {
                    if (imgProfile) {
                        return (
                            <Avatar img={'data:image/webp;base64,' + imgProfile.serialCompressed} />
                        );
                    }
                }}
            </div>
        </section>
    );
}