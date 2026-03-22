const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const store = require('../data/store');

// 生成 PDF 租約
async function generateContractPDF(booking, equipment, user, signatureBase64) {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    
    // 嵌入字型（使用標準字型）
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = height - 50;
    
    // 標題
    page.drawText('Equipment Rental Contract', {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0)
    });
    
    yPosition -= 40;
    
    // 租約編號和日期
    const contractNumber = `CNT-${new Date().getFullYear()}-${String(booking.id).padStart(4, '0')}`;
    page.drawText(`Contract No: ${contractNumber}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font
    });
    
    yPosition -= 20;
    page.drawText(`Date: ${new Date().toLocaleDateString('zh-TW')}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font
    });
    
    yPosition -= 40;
    
    // 租用者資訊
    page.drawText('Renter Information:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    yPosition -= 25;
    // 使用英文標籤避免中文編碼問題
    const userName = user.name.replace(/[^\x00-\x7F]/g, '?'); // 將中文替換為?
    page.drawText(`Name: ${userName}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 20;
    page.drawText(`Account: ${user.username || 'Guest'}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 40;
    
    // 器材資訊
    page.drawText('Equipment Information:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    yPosition -= 25;
    // 移除中文字元避免PDF編碼錯誤
    const equipmentName = equipment.name.replace(/[^\x00-\x7F]/g, '?');
    const equipmentCategory = equipment.category.replace(/[^\x00-\x7F]/g, '?');
    page.drawText(`Equipment: ${equipmentName}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 20;
    page.drawText(`Category: ${equipmentCategory}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 40;
    
    // 租用時段
    page.drawText('Rental Period:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    yPosition -= 25;
    page.drawText(`Start: ${new Date(booking.startTime).toLocaleString('zh-TW')}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 20;
    page.drawText(`End: ${new Date(booking.endTime).toLocaleString('zh-TW')}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 20;
    page.drawText(`Total Hours: ${booking.totalHours}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 40;
    
    // 費用資訊
    page.drawText('Payment Information:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    yPosition -= 25;
    page.drawText(`Hourly Rate: NT$ ${equipment.hourlyRate}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 20;
    page.drawText(`Total Amount: NT$ ${booking.totalAmount}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 20;
    page.drawText(`Deposit: NT$ ${equipment.depositAmount}`, {
      x: 70,
      y: yPosition,
      size: 11,
      font: font
    });
    
    yPosition -= 40;
    
    // 租賃條款
    page.drawText('Terms and Conditions:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });
    
    yPosition -= 25;
    const terms = [
      '1. The renter must return the equipment on time.',
      '2. Any damage will be deducted from the deposit.',
      '3. The renter is responsible for equipment safety.',
      '4. Late return may incur additional charges.'
    ];
    
    terms.forEach(term => {
      page.drawText(term, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font
      });
      yPosition -= 18;
    });
    
    yPosition -= 30;
    
    // 簽名
    if (signatureBase64) {
      try {
        // 移除 data:image/png;base64, 前綴
        const base64Data = signatureBase64.replace(/^data:image\/\w+;base64,/, '');
        const signatureImage = await pdfDoc.embedPng(base64Data);
        
        page.drawText('Signature:', {
          x: 50,
          y: yPosition,
          size: 12,
          font: boldFont
        });
        
        const signatureDims = signatureImage.scale(0.3);
        page.drawImage(signatureImage, {
          x: 150,
          y: yPosition - 50,
          width: signatureDims.width,
          height: signatureDims.height
        });
        
        yPosition -= 70;
      } catch (err) {
        console.error('簽名嵌入失敗:', err);
      }
    }
    
    // 時間戳記
    page.drawText(`Signed at: ${new Date().toLocaleString('zh-TW')}`, {
      x: 50,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    const pdfBytes = await pdfDoc.save();
    return { pdfBytes, contractNumber };
  } catch (error) {
    console.error('生成 PDF 失敗:', error);
    // 即使PDF生成失敗，也繼續建立租約記錄
    return { pdfBytes: null, contractNumber: `CNT-${new Date().getFullYear()}-${String(booking.id).padStart(4, '0')}` };
  }
}

// 簽署租約
exports.sign = async (req, res) => {
  try {
    const { bookingId, signature } = req.body;
    const userId = req.session.userId;
    
    if (!bookingId || !signature) {
      return res.status(400).json({ error: '缺少必要參數' });
    }
    
    // 檢查預約
    const booking = store.bookings.find(b => b.id === parseInt(bookingId));
    if (!booking) {
      return res.status(404).json({ error: '預約不存在' });
    }
    
    if (booking.userId !== userId) {
      return res.status(403).json({ error: '無權限簽署此租約' });
    }
    
    // 取得器材和使用者資訊
    const equipment = store.equipment.find(e => e.id === booking.equipmentId);
    const user = store.users.find(u => u.id === userId);
    
    if (!equipment || !user) {
      return res.status(404).json({ error: '器材或使用者不存在' });
    }
    
    // 生成 PDF
    const { pdfBytes, contractNumber } = await generateContractPDF(booking, equipment, user, signature);
    
    // 將 PDF 轉為 Base64 儲存（展示版暫存方案）
    let pdfDataUrl = null;
    if (pdfBytes) {
      const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
      pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;
    }
    
    // 建立租約記錄
    const contract = {
      id: store.getNextId('contracts'),
      bookingId: booking.id,
      userId,
      contractNumber,
      signatureUrl: signature, // Base64 簽名
      pdfUrl: pdfDataUrl, // Base64 PDF
      signedAt: new Date(),
      status: 'signed',
      createdAt: new Date()
    };
    
    store.contracts.push(contract);
    
    // 更新預約狀態
    booking.status = 'confirmed';
    
    // 建立押金記錄
    const deposit = {
      id: store.getNextId('deposits'),
      bookingId: booking.id,
      userId,
      amount: equipment.depositAmount,
      status: 'paid',
      refundedAt: null,
      deductedAmount: 0,
      reason: null,
      createdAt: new Date()
    };
    
    store.deposits.push(deposit);
    
    res.json({
      success: true,
      contract: {
        id: contract.id,
        contractNumber: contract.contractNumber,
        signedAt: contract.signedAt
      }
    });
  } catch (error) {
    console.error('簽署失敗:', error);
    res.status(500).json({ error: '簽署失敗', message: error.message });
  }
};

// 取得租約列表
exports.getAll = (req, res) => {
  try {
    const userId = req.session.userId;
    const user = store.users.find(u => u.id === userId);
    
    let contracts = [...store.contracts];
    
    // 非管理員只能看自己的租約
    if (user.role !== 'admin') {
      contracts = contracts.filter(c => c.userId === userId);
    }
    
    // 加入預約和器材資訊
    contracts = contracts.map(c => {
      const booking = store.bookings.find(b => b.id === c.bookingId);
      const equipment = booking ? store.equipment.find(e => e.id === booking.equipmentId) : null;
      return {
        ...c,
        equipmentName: equipment ? equipment.name : '未知',
        startTime: booking ? booking.startTime : null,
        endTime: booking ? booking.endTime : null
      };
    });
    
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: '取得租約失敗', message: error.message });
  }
};

// 取得單一租約
exports.getById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.session.userId;
    const user = store.users.find(u => u.id === userId);
    
    const contract = store.contracts.find(c => c.id === id);
    if (!contract) {
      return res.status(404).json({ error: '租約不存在' });
    }
    
    // 權限檢查
    if (contract.userId !== userId && user.role !== 'admin') {
      return res.status(403).json({ error: '無權限查看此租約' });
    }
    
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: '取得租約失敗', message: error.message });
  }
};

// 下載 PDF
exports.downloadPDF = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.session.userId;
    const user = store.users.find(u => u.id === userId);
    
    const contract = store.contracts.find(c => c.id === id);
    if (!contract) {
      return res.status(404).json({ error: '租約不存在' });
    }
    
    // 權限檢查
    if (contract.userId !== userId && user.role !== 'admin') {
      return res.status(403).json({ error: '無權限下載此租約' });
    }
    
    if (!contract.pdfUrl) {
      return res.status(404).json({ error: 'PDF 不存在' });
    }
    
    // 將 Base64 轉回 Buffer
    const base64Data = contract.pdfUrl.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${contract.contractNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: '下載失敗', message: error.message });
  }
};

module.exports = exports;
