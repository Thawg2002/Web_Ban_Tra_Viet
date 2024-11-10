

import { fetchPosts } from "@/services/post";
import { useQuery } from "@tanstack/react-query";


import { Spin } from "antd";
const AboutPage = () => {
    // Fetch data using useQuery (React Query v5 object form)
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts"], // Provide query key as part of an object
        queryFn: fetchPosts, // Fetch function
    });

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Spin
                    tip="Đang tải..."
                    size="large"
                    className="text-blue-500"
                />
            </div>
        );
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const postData = Array.isArray(data) ? data[0] : data;
    const postData1 = Array.isArray(data) ? data[1] : data;
    console.log(postData1);
    console.log(postData);
    if (!postData) {
        return (
            <div className="flex items-center justify-center h-screen bg-green-50">
                <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-green-700">
                        Không có dữ liệu post
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Rất tiếc, chúng tôi hiện không có bài viết nào về trà.
                        Hãy quay lại sau để tìm hiểu thêm về sản phẩm và câu
                        chuyện trà Việt.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-5 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all"
                    >
                        Tải lại trang
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-gray-800">
            {/* Title */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {postData?.title || "Tiêu đề không có sẵn"}
                </h1>
                {postData?.introduction?.heading && (
                    <div className="mt-4 text-red-500 uppercase tracking-wide font-semibold">
                        {postData.introduction.heading}
                    </div>
                )}

                {/* Introduction Paragraphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 text-gray-700">
                    {postData?.introduction?.paragraphs?.length > 0 ? (
                        postData.introduction.paragraphs.map(
                            (paragraph, index) => (
                                <p
                                    key={index}
                                    className="mt-2 text-sm leading-relaxed font-roboto"
                                >
                                    {paragraph.paragraph}
                                </p>
                            ),
                        )
                    ) : (
                        <p>Không có đoạn giới thiệu</p>
                    )}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
                    {postData?.team && postData.team.length > 0 && (
                        <>
                            {/* Ảnh của người đầu tiên trong team */}
                            {postData.team[0].gallery &&
                                postData.team[0].gallery.length > 0 && (
                                    <img
                                        src={postData.team[0].gallery[0]}
                                        alt={
                                            postData.team[0].name || "Chairman"
                                        }
                                        className="rounded-full w-24 h-24 sm:w-12 sm:h-12"
                                    />
                                )}
                            <div>
                                {/* Tên và chức vụ của người đầu tiên */}
                                <p className="text-gray-900 font-semibold">
                                    {postData.team[0].name || "Đinh Minh Phú"} –{" "}
                                    <span className="font-normal">
                                        {postData.team[0].role ||
                                            "Founder, Chairman"}
                                    </span>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-5">
                {Array.isArray(postData?.image) &&
                postData?.image.length > 0 ? (
                    postData.image.map((images, index) => (
                        <img
                            key={index}
                            className="w-full max-w-full md:w-[700px] md:h-[430px] object-cover"
                            src={images}
                            alt={`Blog Image ${index + 1}`}
                        />
                    ))
                ) : (
                    <p>Không có hình ảnh để hiển thị</p>
                )}
            </div>

            {postData?.mission && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-red-500 uppercase tracking-wide font-semibold">
                        {postData.mission.heading || "Sứ mệnh"}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
                        {postData.mission.title || "Tiêu đề Sứ mệnh"}
                    </h1>

                    {/* Mission Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-gray-700">
                        {postData.mission.content?.length > 0 ? (
                            postData.mission.content.map(
                                (contentItem, index) => (
                                    <div key={index}>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {contentItem.title}
                                        </h2>
                                        {contentItem.paragraphs.map(
                                            (paragraph, i) => (
                                                <p
                                                    key={i}
                                                    className="mt-4 text-sm font-roboto"
                                                >
                                                    {paragraph.paragraph}
                                                </p>
                                            ),
                                        )}
                                    </div>
                                ),
                            )
                        ) : (
                            <p>Không có nội dung sứ mệnh</p>
                        )}
                    </div>
                </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {postData1?.title}
                </h1>
                {postData1?.introduction?.heading && (
                    <div className="mt-4 text-red-500 uppercase tracking-wide font-semibold">
                        {postData1.introduction.heading}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 text-gray-700">
                    {postData1?.introduction?.paragraphs?.length > 0 &&
                        postData1.introduction.paragraphs.map(
                            (paragraph, index) => (
                                <p key={index} className="mt-4">
                                    {paragraph.paragraph}
                                </p>
                            ),
                        )}
                </div>
            </div>
            {postData1?.mission && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-red-500 uppercase tracking-wide font-semibold">
                        {postData1.mission.heading || "Sứ mệnh"}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
                        {postData1.mission.title || "Tiêu đề Sứ mệnh"}
                    </h1>

                    {/* Mission Content */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mt-8 text-gray-700">
                        {postData1.mission.content?.length > 0 ? (
                            postData1.mission.content.map(
                                (contentItem, index) => (
                                    <div key={index}>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {contentItem.title}
                                        </h2>
                                        {contentItem.paragraphs.map(
                                            (paragraph, i) => (
                                                <p
                                                    key={i}
                                                    className="mt-4 text-sm font-roboto"
                                                >
                                                    {paragraph.paragraph}
                                                </p>
                                            ),
                                        )}
                                    </div>
                                ),
                            )
                        ) : (
                            <p>Không có nội dung sứ mệnh</p>
                        )}
                    </div>
                </div>
            )}
            
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-red-500 uppercase tracking-wide font-semibold">
                    Our Team
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mt-4">
                    Phía sau Trà Việt
                </h1>
                <div className="flex flex-wrap justify-center gap-10 mt-10">
                    {postData?.team &&
                        postData.team.map((member, index) => (
                            <div key={index} className="text-center max-w-xs">
                                <img
                                    src={member.gallery}
                                    alt={member.name}
                                    className="w-32 h-32 mx-auto rounded-full object-cover mb-4 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                                />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {member.name}
                                </h3>
                                <p className="text-gray-500 mb-2">
                                    {member.title}
                                </p>
                                <p className="text-gray-600 italic">
                                    {member.quote}
                                </p>
                            </div>
                        ))}

                 
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
