import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Table, Typography, Space, Row, Col, message } from 'antd';
import { ScissorOutlined, CodeSandboxOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import { getLocalStorage, setLocalStorage } from '../../utils/storage';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Hòa' | 'Thua';

interface GameRecord {
    round: number;
    player: Choice;
    computer: Choice;
    result: Result;
    time: string;
}

const HISTORY_KEY = 'APP_RPS_HISTORY';

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

const getResult = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'Hòa';
    if (
        (player === 'Kéo' && computer === 'Bao') ||
        (player === 'Búa' && computer === 'Kéo') ||
        (player === 'Bao' && computer === 'Búa')
    ) {
        return 'Thắng';
    }
    return 'Thua';
};

const RockPaperScissors: React.FC = () => {
    const [history, setHistory] = useState<GameRecord[]>(() => getLocalStorage(HISTORY_KEY, []));
    const [lastRound, setLastRound] = useState<GameRecord | null>(null);

    useEffect(() => {
        setLocalStorage(HISTORY_KEY, history);
    }, [history]);

    const playRound = (playerChoice: Choice) => {
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        const result = getResult(playerChoice, computerChoice);

        const newRecord: GameRecord = {
            round: history.length + 1,
            player: playerChoice,
            computer: computerChoice,
            result,
            time: moment().format('HH:mm:ss DD/MM'),
        };

        setLastRound(newRecord);
        setHistory(prev => [newRecord, ...prev]);
    };

    const resetGame = () => {
        setHistory([]);
        setLastRound(null);
        message.success('Đã làm mới quá trình chơi!');
    };

    const getResultColor = (res: Result) => {
        if (res === 'Thắng') return '#52c41a';
        if (res === 'Thua') return '#ff4d4f';
        return '#faad14';
    };

    const columns: ColumnsType<GameRecord> = [
        { title: 'Vòng', dataIndex: 'round', key: 'round', width: 80 },
        { title: 'Người chơi', dataIndex: 'player', key: 'player' },
        { title: 'Máy tính', dataIndex: 'computer', key: 'computer' },
        {
            title: 'Kết quả',
            dataIndex: 'result',
            key: 'result',
            render: (res: Result) => <Text strong style={{ color: getResultColor(res) }}>{res}</Text>
        },
        { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    ];

    return (
        <PageContainer title="Trò chơi Oẳn Tù Tì">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={10}>
                    <Card title="Chơi Game" bordered={false} style={{ textAlign: 'center' }}>
                        <Title level={4}>Chọn nước đi của bạn</Title>
                        <Space size="large" style={{ margin: '24px 0' }}>
                            <Button
                                size="large"
                                type="primary"
                                shape="round"
                                icon={<ScissorOutlined />}
                                onClick={() => playRound('Kéo')}
                            >
                                Kéo
                            </Button>
                            <Button
                                size="large"
                                type="primary"
                                shape="round"
                                icon={<CodeSandboxOutlined />}
                                onClick={() => playRound('Búa')}
                                style={{ backgroundColor: '#795548', borderColor: '#795548' }}
                            >
                                Búa
                            </Button>
                            <Button
                                size="large"
                                type="primary"
                                shape="round"
                                icon={<FileTextOutlined />}
                                onClick={() => playRound('Bao')}
                                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} // Default blue is fine, just distinct
                            >
                                Bao
                            </Button>
                        </Space>

                        {lastRound && (
                            <Card type="inner" title="Kết quả vòng vừa rồi" style={{ marginTop: 24, backgroundColor: '#fafafa' }}>
                                <Row>
                                    <Col span={8}>
                                        <Text type="secondary">Bạn chọn:</Text><br />
                                        <Text strong style={{ fontSize: 18 }}>{lastRound.player}</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Text type="secondary">Máy chọn:</Text><br />
                                        <Text strong style={{ fontSize: 18 }}>{lastRound.computer}</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Text type="secondary">Kết quả:</Text><br />
                                        <Text strong style={{ fontSize: 24, color: getResultColor(lastRound.result) }}>
                                            {lastRound.result}
                                        </Text>
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={14}>
                    <Card
                        title="Lịch sử chơi"
                        bordered={false}
                        extra={<Button icon={<ReloadOutlined />} onClick={resetGame} danger>Làm mới</Button>}
                    >
                        <Table
                            columns={columns}
                            dataSource={history}
                            rowKey="round"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default RockPaperScissors;
