import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, InputNumber, Button, Typography, Space, List, Tag, Alert, Input } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MAX_ATTEMPTS = 10;

const GuessingGame: React.FC = () => {
    const [targetNumber, setTargetNumber] = useState(0);
    const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
    const [currentGuess, setCurrentGuess] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [history, setHistory] = useState<{ guess: number; feedback: string }[]>([]);

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        setTargetNumber(Math.floor(Math.random() * 100) + 1);
        setAttemptsLeft(MAX_ATTEMPTS);
        setCurrentGuess(null);
        setFeedback(null);
        setGameOver(false);
        setHistory([]);
    };

    const handleGuess = () => {
        if (currentGuess === null || gameOver) return;

        const newAttemptsLimit = attemptsLeft - 1;
        setAttemptsLeft(newAttemptsLimit);

        let guessFeedback = '';
        let feedbackType: 'success' | 'warning' | 'error' | 'info' = 'info';

        if (currentGuess === targetNumber) {
            guessFeedback = 'Chính xác! Bạn đã đoán trúng.';
            feedbackType = 'success';
            setGameOver(true);
        } else if (currentGuess < targetNumber) {
            guessFeedback = 'Quá thấp';
            feedbackType = 'warning';
        } else {
            guessFeedback = 'Quá cao';
            feedbackType = 'warning';
        }

        if (newAttemptsLimit === 0 && currentGuess !== targetNumber) {
            guessFeedback = `Hết lượt! Số cần tìm là ${targetNumber}`;
            feedbackType = 'error';
            setGameOver(true);
        }

        setFeedback({ message: guessFeedback, type: feedbackType });
        setHistory([{ guess: currentGuess, feedback: guessFeedback }, ...history]);
        setCurrentGuess(null);
    };

    return (
        <PageContainer title="Number Guessing Game">
            <Card style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                <Title level={4}>Đoán một số từ 1 đến 100</Title>

                <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 24 }}>
                    <div style={{ fontSize: '18px' }}>
                        Số lượt đoán còn lại:{' '}
                        <Text type={attemptsLeft <= 3 ? 'danger' : 'success'} strong style={{ fontSize: '24px' }}>
                            {attemptsLeft}
                        </Text>
                    </div>

                    {feedback && (
                        <Alert message={feedback.message} type={feedback.type} showIcon />
                    )}

                    <Input.Group compact style={{ display: 'flex', justifyContent: 'center' }}>
                        <InputNumber
                            min={1}
                            max={100}
                            value={currentGuess}
                            onChange={(val) => setCurrentGuess(val)}
                            disabled={gameOver}
                            placeholder="Nhập số dự đoán..."
                            style={{ width: '200px' }}
                            onPressEnter={handleGuess}
                            size="large"
                        />
                        <Button
                            type="primary"
                            onClick={handleGuess}
                            disabled={currentGuess === null || gameOver}
                            size="large"
                        >
                            Đoán
                        </Button>
                    </Input.Group>

                    <Button icon={<ReloadOutlined />} onClick={initGame} size="large" style={{ marginTop: 16 }}>
                        Chơi Lại
                    </Button>

                    {history.length > 0 && (
                        <div style={{ marginTop: 24, textAlign: 'left' }}>
                            <Title level={5}>Lịch sử dự đoán:</Title>
                            <List
                                size="small"
                                bordered
                                dataSource={history}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Text strong style={{ width: 40 }}>{item.guess}</Text> -{' '}
                                        <Tag color={item.feedback === 'Quá thấp' ? 'blue' : item.feedback === 'Quá cao' ? 'red' : 'green'}>
                                            {item.feedback === 'Quá thấp' ? <ArrowUpOutlined /> : item.feedback === 'Quá cao' ? <ArrowDownOutlined /> : <CheckCircleOutlined />} {item.feedback}
                                        </Tag>
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}
                </Space>
            </Card>
        </PageContainer>
    );
};

export default GuessingGame;
