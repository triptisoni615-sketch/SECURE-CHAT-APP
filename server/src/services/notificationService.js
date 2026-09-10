export const sendNotification = ({
    io,
    userId,
    data
}) => {

    io.to(
        `user:${userId}`
    ).emit(
        "notification",
        data
    );

};